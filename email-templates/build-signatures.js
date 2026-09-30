#!/usr/bin/env node
// Regenerates the static Error404-M365-Signature-*.html placeholder files from
// signature.js, so they always match what the site's "Copy signature" button
// produces. Run from anywhere: `node email-templates/build-signatures.js`.
'use strict';
const fs = require('fs');
const path = require('path');
require('./signature.js');

const dir = __dirname;
const build = globalThis.Error404Signature.build;

function header(variant, extra) {
  return `<!--
  ERROR404.NET — Outlook / M365 Email Signature (${variant})
  ---------------------------------------------------------------
  Easiest install: use the generator at https://branding.error404.net/#signature —
  fill in your details, press "Copy signature", paste into Outlook:
    - new Outlook / Outlook on the web: Settings > Mail > Compose and reply > Email signature
    - classic Outlook: File > Options > Mail > Signatures
${extra}
  This file is the generator's output with <Bracketed> placeholders, for
  Exchange admin / transport-rule deployment or hand-editing. Do not edit the
  markup here directly — change email-templates/signature.js and run
  \`node email-templates/build-signatures.js\`, so the site's copy button and
  these files stay identical.

  Image is hosted on the brand site's GitHub Pages deploy
  (${globalThis.Error404Signature.IMG_BASE}), served at
  2x and displayed at half size so it stays sharp on high-DPI screens.
-->
`;
}

// One element per line, for readable diffs. Whitespace between table cells is
// ignored by every mail client, so this doesn't change rendering.
function pretty(html) {
  return html.replace(/(<\/?(?:table|tr)\b[^>]*>|<td\b[^>]*>)/g, '\n$1').replace(/^\n/, '') + '\n';
}

const placeholders = { name: '<Full Name>', title: '<Title>', email: 'you@error404.net', phone: '<phone>' };

const files = {
  'Error404-M365-Signature-Standard.html':
    header('Standard', '') + pretty(build(placeholders, 'standard').html),
  'Error404-M365-Signature-Minimal.html':
    header('Minimal', '\n  One-line version for mobile replies, secondary accounts, or anyone who\n  wants something lighter than the Standard signature.\n') +
    pretty(build(placeholders, 'minimal').html),
};

for (const [name, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(dir, name), content);
  console.log('wrote', name);
}
