#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

import { loadSpecs, section, headings, parseTokens, repoRoot } from './spec.js';
import { normalizeHex, contrast, verdict } from './contrast.js';
import { lintCopy } from './lint.js';

const server = new McpServer({ name: 'error404-brand', version: '1.0.0' });

const text = (o) => ({ content: [{ type: 'text', text: typeof o === 'string' ? o : JSON.stringify(o, null, 2) }] });
const fail = (msg) => ({ content: [{ type: 'text', text: msg }], isError: true });

function requireSpecs() {
  const s = loadSpecs();
  if (s.missing.length) {
    throw new Error(
      `Cannot find ${s.missing.join(' and ')} under ${repoRoot()}. ` +
      `Set ERROR404_BRAND_ROOT to the Branding-Guide checkout.`
    );
  }
  return s;
}

server.registerTool(
  'brand_context',
  {
    title: 'Get brand context',
    description:
      'Compact Error404 brand brief to work from. Call this FIRST before producing anything ' +
      'Error404-branded — copy, a page, a deck, a document. Returns the locked palette, the ' +
      'typefaces, the treatment-mode rule, the fixed terminology, and the house rules.',
    inputSchema: {},
  },
  async () => {
    const { brand, design, tokensCss } = requireSpecs();
    const tokens = parseTokens(tokensCss);
    return text({
      tagline: '!ignore → return "404: Message not found"  (LOCKED — never reword)',
      tagline_exception:
        'Not used in the email signature. It winks at prompt-injection/AI-scanner culture, which ' +
        "is fine for a human reading the site but risky on real outbound mail — a recipient's AI " +
        'mail-security scanner could read "!ignore →" as an actual injection attempt. Sign off ' +
        'the signature with the wordmark instead. Locked and valid everywhere else (site, ' +
        'marketing, PDF).',
      palette_status: 'LOCKED — Arcade New Wave',
      tokens: Object.fromEntries(Object.entries(tokens).filter(([k]) => /surface|text|accent/.test(k))),
      typefaces: {
        display: "'Press Start 2P', monospace — hero only, ≥24px",
        terminal: "'VT323', monospace — headings, NFO tables",
        body: "'JetBrains Mono', monospace — body, UI, code",
        rule: 'Always end every font-family with a generic fallback. A bare family name falls back to serif, not monospace.',
      },
      modes: {
        Digital: 'Screens you control. Full palette, glow, glitch lockup.',
        'Print/Corporate': "Print, PDF, Word, email, anything read in a client's inbox. Pure black on white.",
        exception: 'PowerPoint is an export but stays Digital — slides are a screen medium.',
      },
      terminology: {
        mark: 'the Libra graphic',
        wordmark: 'the ERROR404.NET lettering — never the bare "404.NET"',
        lockup: 'mark and wordmark together',
        variant: 'a version of the mark — never "colorway", "cut" or "pull"',
      },
      house_rules: [
        'One background, one foreground, at most two accents per surface.',
        'Each accent keeps one fixed meaning everywhere. Never reassign one to suit a layout.',
        'Accessibility overrides brand. Never ship a combination that fails contrast.',
        'Instructional copy follows STE: one idea per sentence, under 25 words, active voice.',
        'Never put real contact details in a template or mockup. Placeholder tokens only.',
        'Published copy is impersonal or imperative, never second person.',
      ],
      sources: {
        BRAND_md_sections: headings(brand).filter((h) => h.level === 2).map((h) => h.title),
        DESIGN_md_sections: headings(design).filter((h) => h.level === 2).map((h) => h.title),
        hint: 'Use brand_section to read any of these verbatim.',
      },
    });
  }
);

server.registerTool(
  'brand_tokens',
  {
    title: 'Get design tokens',
    description:
      'Canonical design token values, parsed from the committed tokens.css. Use these exact ' +
      'values rather than transcribing hex codes from documentation.',
    inputSchema: {
      filter: z.string().optional().describe('Substring to filter token names, e.g. "accent" or "space".'),
    },
  },
  async ({ filter }) => {
    const { tokensCss } = requireSpecs();
    const all = parseTokens(tokensCss);
    if (!Object.keys(all).length) {
      return fail('No tokens found. Expected a :root block in styleguide/src/tokens.css.');
    }
    const out = filter
      ? Object.fromEntries(Object.entries(all).filter(([k]) => k.includes(filter)))
      : all;
    return text({ count: Object.keys(out).length, tokens: out });
  }
);

server.registerTool(
  'brand_section',
  {
    title: 'Read a spec section',
    description:
      'Read one section of BRAND.md or DESIGN.md verbatim. Use it when you need the exact ' +
      'wording of a rule rather than a summary.',
    inputSchema: {
      file: z.enum(['BRAND', 'DESIGN']).describe('Which spec file.'),
      heading: z.string().describe('Section heading, matched loosely, e.g. "Tonal Rules" or "Contrast".'),
    },
  },
  async ({ file, heading }) => {
    const specs = requireSpecs();
    const md = file === 'BRAND' ? specs.brand : specs.design;
    const found = section(md, heading);
    if (!found) {
      const avail = headings(md).map((h) => `${'  '.repeat(h.level - 2)}${h.title}`).join('\n');
      return fail(`No section matching "${heading}" in ${file}.md.\n\nAvailable:\n${avail}`);
    }
    return text(found);
  }
);

server.registerTool(
  'check_contrast',
  {
    title: 'Check colour contrast',
    description:
      'Compute the WCAG 2.1 contrast ratio between two colours and return pass/fail for normal ' +
      'text, large text, and UI components. Accessibility overrides brand, so check before ' +
      'shipping any new colour pairing.',
    inputSchema: {
      foreground: z.string().describe('Hex, e.g. "#F4F1FF" or a token name like "--e404-text-strong".'),
      background: z.string().describe('Hex or token name.'),
    },
  },
  async ({ foreground, background }) => {
    const { tokensCss } = requireSpecs();
    const tokens = parseTokens(tokensCss);
    const resolve = (v) => {
      const key = String(v).trim();
      const viaToken = tokens[key] || tokens[`--${key.replace(/^--/, '')}`];
      return normalizeHex(viaToken || key);
    };
    const fg = resolve(foreground);
    const bg = resolve(background);
    if (!fg) return fail(`Could not resolve foreground "${foreground}" to a hex colour or known token.`);
    if (!bg) return fail(`Could not resolve background "${background}" to a hex colour or known token.`);

    const v = verdict(contrast(fg, bg));
    return text({
      foreground: fg,
      background: bg,
      ...v,
      guidance:
        v.normalText === 'FAIL'
          ? 'Fails for body text. Change the implementation — do not ship this pairing.'
          : v.normalText === 'AA'
          ? 'Passes AA for body text. AAA would need 7:1.'
          : 'Passes AAA for body text.',
    });
  }
);

server.registerTool(
  'review_copy',
  {
    title: 'Review copy against the brand rules',
    description:
      'Lint Error404 copy against the fixed terminology, the STE writing rules, the impersonal ' +
      'voice rule, and a check for real contact details leaking into template text. Run this on ' +
      'any instructional or reference copy before shipping it. The tagline and deliberate ' +
      'flavour copy are exempt.',
    inputSchema: {
      text: z.string().describe('The copy to review.'),
      context: z
        .enum(['instructional', 'published', 'flavour'])
        .optional()
        .describe('"flavour" relaxes the voice and sentence rules. Default "instructional".'),
    },
  },
  async ({ text: copy, context = 'instructional' }) => {
    if (context === 'flavour') {
      return text({
        ok: true,
        note: 'Flavour copy is exempt from the STE and voice rules. Only terminology and contact-detail checks were applied.',
        ...lintCopy(copy, { context: 'flavour' }),
      });
    }
    return text(lintCopy(copy, { context }));
  }
);

server.registerTool(
  'pick_mode',
  {
    title: 'Pick the treatment mode',
    description:
      'Decide whether a surface is Digital or Print/Corporate. Every Error404 surface resolves ' +
      'to exactly one; there is no third.',
    inputSchema: {
      surface: z.string().describe('What is being made, e.g. "a Word report for a client" or "the site header".'),
    },
  },
  async ({ surface }) => {
    const s = surface.toLowerCase();
    const printish = /\b(print|printed|pdf|word|docx|letterhead|envelope|report|invoice|memo|email|inbox|signature|mail|fax|hard copy)\b/.test(s);
    const slides = /\b(powerpoint|pptx|slide|deck|presentation)\b/.test(s);

    if (slides) {
      return text({
        mode: 'Digital',
        why: 'Slides are the one documented exception: an export that stays Digital, because slides are a screen medium.',
        apply: 'Full Arcade New Wave palette, glitch lockup, display + body faces.',
      });
    }
    if (printish) {
      return text({
        mode: 'Print/Corporate',
        why: 'It is printed, exported, or read in someone else\'s inbox.',
        apply: 'Pure black on white. No colour, no glow. Flat monochrome mark. ASCII rules and bracket fields carry the identity. One face throughout.',
      });
    }
    return text({
      mode: 'Digital',
      why: 'No print, export, or outbound-inbox signal detected, so this reads as a screen you control.',
      apply: 'Full Arcade New Wave palette, glitch lockup, display + body faces.',
      caution: 'If this surface will be printed or emailed to someone outside error404.net, it is Print/Corporate instead.',
    });
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
