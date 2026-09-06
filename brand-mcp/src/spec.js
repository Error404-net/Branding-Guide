import fs from 'node:fs';
import path from 'node:path';

// The spec files are the source of truth. This module reads them at call time
// rather than embedding a copy, so the server can never disagree with the
// committed BRAND.md / DESIGN.md.

export function repoRoot() {
  return process.env.ERROR404_BRAND_ROOT || process.cwd();
}

function readIfPresent(rel) {
  const p = path.join(repoRoot(), rel);
  try {
    return fs.readFileSync(p, 'utf8');
  } catch {
    return null;
  }
}

export function loadSpecs() {
  const brand = readIfPresent('BRAND.md');
  const design = readIfPresent('DESIGN.md');
  const tokensCss = readIfPresent('styleguide/src/tokens.css');
  const missing = [];
  if (!brand) missing.push('BRAND.md');
  if (!design) missing.push('DESIGN.md');
  return { brand, design, tokensCss, missing };
}

/** Pull one `## Heading` or `### Heading` section out of a markdown document. */
export function section(md, heading) {
  if (!md) return null;
  const lines = md.split('\n');
  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const want = norm(heading);
  let start = -1;
  let level = 0;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^(#{2,4})\s+(.*)$/);
    if (m && norm(m[2]).includes(want)) {
      start = i;
      level = m[1].length;
      break;
    }
  }
  if (start === -1) return null;
  const out = [lines[start]];
  for (let i = start + 1; i < lines.length; i++) {
    const m = lines[i].match(/^(#{2,4})\s+/);
    if (m && m[1].length <= level) break;
    out.push(lines[i]);
  }
  return out.join('\n').trim();
}

/** List every heading, so callers can discover what is available. */
export function headings(md) {
  if (!md) return [];
  return md
    .split('\n')
    .map((l) => l.match(/^(#{2,4})\s+(.*)$/))
    .filter(Boolean)
    .map((m) => ({ level: m[1].length, title: m[2].replace(/\s*\{.*$/, '').trim() }));
}

/** Canonical token values, parsed from the :root block of tokens.css. */
export function parseTokens(css) {
  if (!css) return {};
  const root = css.match(/:root\s*\{([\s\S]*?)\}/);
  if (!root) return {};
  const out = {};
  for (const m of root[1].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    out[m[1].trim()] = m[2].trim().replace(/\s*\/\*.*$/, '').trim();
  }
  return out;
}

/** Parse a GitHub-flavoured markdown table into row objects. */
export function parseTable(block) {
  if (!block) return [];
  const lines = block.split('\n').filter((l) => l.trim().startsWith('|'));
  if (lines.length < 2) return [];
  const cells = (l) => l.split('|').slice(1, -1).map((c) => c.trim());
  const head = cells(lines[0]);
  return lines
    .slice(2)
    .map((l) => Object.fromEntries(cells(l).map((c, i) => [head[i] || `col${i}`, c])))
    .filter((r) => Object.values(r).some(Boolean));
}
