// Smoke test: speak MCP over stdio and exercise every tool.
// Run with the repo root in ERROR404_BRAND_ROOT.

import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const entry = path.join(here, '..', 'src', 'index.js');
const root = process.env.ERROR404_BRAND_ROOT || path.join(here, '..', '..');

const child = spawn('node', [entry], {
  stdio: ['pipe', 'pipe', 'pipe'],
  env: { ...process.env, ERROR404_BRAND_ROOT: root },
});

let buf = '';
const pending = new Map();
child.stdout.on('data', (d) => {
  buf += d.toString();
  let i;
  while ((i = buf.indexOf('\n')) !== -1) {
    const line = buf.slice(0, i).trim();
    buf = buf.slice(i + 1);
    if (!line) continue;
    let msg;
    try { msg = JSON.parse(line); } catch { continue; }
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
  }
});
child.stderr.on('data', (d) => process.stderr.write('[server] ' + d));

let id = 0;
const send = (method, params) =>
  new Promise((res) => {
    const myId = ++id;
    pending.set(myId, res);
    child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id: myId, method, params }) + '\n');
  });

const results = [];
const check = (name, cond, detail = '') => {
  results.push({ name, pass: !!cond, detail });
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`);
};

const body = (r) => r?.result?.content?.[0]?.text ?? '';
const json = (r) => { try { return JSON.parse(body(r)); } catch { return null; } };

await send('initialize', {
  protocolVersion: '2024-11-05',
  capabilities: {},
  clientInfo: { name: 'smoke', version: '1' },
});
child.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n');

const list = await send('tools/list', {});
const names = (list.result?.tools || []).map((t) => t.name).sort();
check('tools/list returns all six tools', names.length === 6, names.join(', '));

// brand_context
let r = await send('tools/call', { name: 'brand_context', arguments: {} });
let j = json(r);
check('brand_context returns locked tagline', j?.tagline?.includes('Message not found'));
check('brand_context includes real token values', j?.tokens?.['--e404-accent-primary'] === '#4DE1FF', j?.tokens?.['--e404-accent-primary']);

// brand_tokens
r = await send('tools/call', { name: 'brand_tokens', arguments: { filter: 'accent' } });
j = json(r);
check('brand_tokens filters', j?.count === 4, `count=${j?.count}`);

// brand_section — hit and miss
r = await send('tools/call', { name: 'brand_section', arguments: { file: 'BRAND', heading: 'Tonal Rules' } });
check('brand_section finds a section', body(r).includes('ASD-STE100'));
r = await send('tools/call', { name: 'brand_section', arguments: { file: 'BRAND', heading: 'nonexistent zzz' } });
check('brand_section errors helpfully on miss', r.result?.isError && body(r).includes('Available'));

// check_contrast — by hex, by token, and a known-bad reference pair
r = await send('tools/call', { name: 'check_contrast', arguments: { foreground: '#F4F1FF', background: '#231451' } });
j = json(r);
check('check_contrast computes AAA pair', j?.ratio === 14.63 && j?.normalText === 'AAA', `${j?.ratio}:1 ${j?.normalText}`);

r = await send('tools/call', { name: 'check_contrast', arguments: { foreground: '--e404-accent-primary', background: '--e404-surface' } });
j = json(r);
check('check_contrast resolves token names', j?.foreground === '#4DE1FF' && j?.ratio === 10.49, `${j?.foreground} ${j?.ratio}`);

r = await send('tools/call', { name: 'check_contrast', arguments: { foreground: '#655E93', background: '#231451' } });
j = json(r);
check('check_contrast catches a failing pair (resolved #655E93 defect, kept as a regression case)', j?.normalText === 'FAIL' && j?.ratio === 2.77, `${j?.ratio}:1`);

r = await send('tools/call', { name: 'check_contrast', arguments: { foreground: 'not-a-color', background: '#000' } });
check('check_contrast rejects bad input', r.result?.isError);

// review_copy — should catch terminology, length, PII
const bad = `Our logo colorway is very nice — it was designed by the team — and you should always use it, because the print mode variant of the logo is the one that gets used when a document is being printed and sent to a client who needs it. Contact bob.smith@othercorp.com or 555-123-4567.`;
r = await send('tools/call', { name: 'review_copy', arguments: { text: bad } });
j = json(r);
const rules = new Set((j?.findings || []).map((f) => f.rule));
check('review_copy flags terminology', rules.has('terminology'));
check('review_copy flags real contact details', rules.has('pii'));
check('review_copy flags long sentences', rules.has('sentence-length'));
check('review_copy flags second person', rules.has('voice'));
check('review_copy fails overall on errors', j?.ok === false, `errors=${j?.counts?.error}`);

const good = `The mark sits on a scrim. Print/Corporate mode uses black on white. Use the ham variant for community contexts.`;
r = await send('tools/call', { name: 'review_copy', arguments: { text: good } });
j = json(r);
check('review_copy passes clean copy', j?.ok === true, `errors=${j?.counts?.error}`);

// Regression: banned terms that are substrings of the CORRECT term, or are a
// third party's own field name, must not fire.
const falsePositives = [
  ['Print/Corporate mode is monochrome.', 'correct mode name not flagged as "Corporate mode"'],
  ['Upload the banner logo at 280x60 and the square logo at 240x240.', 'Entra field names "banner logo"/"square logo" not flagged'],
  ['Apply the Office theme file, then load the Discord client theme.', '"theme" as a real file not flagged as the palette'],
];
for (const [sample, label] of falsePositives) {
  r = await send('tools/call', { name: 'review_copy', arguments: { text: sample } });
  j = json(r);
  const termErrors = (j?.findings || []).filter((f) => f.rule === 'terminology' && f.severity === 'error');
  check(`review_copy: ${label}`, termErrors.length === 0, termErrors.map((f) => f.excerpt).join(', '));
}

// ...but the genuinely wrong forms still fire.
r = await send('tools/call', { name: 'review_copy', arguments: { text: 'Use corporate mode for reports. Pick a colorway.' } });
j = json(r);
check(
  'review_copy still catches the wrong forms',
  (j?.findings || []).filter((f) => f.rule === 'terminology').length >= 2,
  `${(j?.findings || []).filter((f) => f.rule === 'terminology').length} terminology findings`
);

// pick_mode
r = await send('tools/call', { name: 'pick_mode', arguments: { surface: 'a Word report for a client' } });
check('pick_mode -> Print/Corporate', json(r)?.mode === 'Print/Corporate');
r = await send('tools/call', { name: 'pick_mode', arguments: { surface: 'a PowerPoint deck' } });
check('pick_mode -> Digital for slides (the exception)', json(r)?.mode === 'Digital');
r = await send('tools/call', { name: 'pick_mode', arguments: { surface: 'the site header' } });
check('pick_mode -> Digital for screens', json(r)?.mode === 'Digital');

child.kill();
const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
