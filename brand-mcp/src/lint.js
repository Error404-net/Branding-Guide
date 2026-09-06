// Copy linter for Error404 instructional and reference text.
//
// Every rule here traces to something written down in BRAND.md, not to general
// writing advice. Rules are heuristics: they flag candidates for a human to
// judge, and say so. False positives are expected and preferable to silence.

// Each pattern must not fire on the CORRECT usage. Where a banned term is a
// substring of an approved one, or is a third party's own field name, the
// pattern excludes that case explicitly - a linter that flags correct copy
// gets switched off, which is worse than not having one.
const TERMS = [
  { bad: /\bcolorways?\b/gi, good: 'variant', why: 'One term per concept: a version of the mark is a "variant".' },
  { bad: /\bpulls?\b(?=\s+(?:from|of)\s+the\s+(?:set|logoset))/gi, good: 'variant', why: 'One term per concept.' },
  {
    // "banner logo" and "square logo" are Entra/M365 field names, not our term.
    bad: /(?<!\b(?:banner|square|channel|server|app|nav-bar|header)\s)\blogos?\b/gi,
    good: 'mark (the graphic) or wordmark (the lettering)',
    why: '"logo" is ambiguous between the mark and the wordmark. Platform field names such as "banner logo" are exempt.',
    severity: 'warn',
  },
  { bad: /\blogotypes?\b/gi, good: 'wordmark', why: 'One term per concept.' },
  { bad: /\bcombo\b/gi, good: 'lockup', why: 'One term per concept.' },
  { bad: /\bfull logo\b/gi, good: 'lockup', why: 'One term per concept.' },
  { bad: /(?<!\/)\bprint mode\b/gi, good: 'Print/Corporate mode', why: 'Always the full mode name.' },
  // Must not match inside the correct term "Print/Corporate mode".
  { bad: /(?<!Print\/)\bcorporate mode\b/gi, good: 'Print/Corporate mode', why: 'Always the full mode name.' },
  { bad: /\bcolor mode\b/gi, good: 'Digital mode', why: 'Always the full mode name.' },
  {
    // "theme" is legitimate for the Office .thmx, the Discord client theme and
    // the M365 admin theme, so only flag it where it clearly means the palette.
    bad: /\bthe (?:color|colour) (?:theme|scheme)\b/gi,
    good: 'Arcade New Wave',
    why: 'The palette has a name.',
    severity: 'warn',
  },
  { bad: /\bTBD\b/g, good: 'a plain statement that it is not decided', why: 'BRAND.md: never say "TBD" or "coming soon".' },
  { bad: /\bcoming soon\b/gi, good: 'a plain statement of status', why: 'BRAND.md: never say "TBD" or "coming soon".' },
];

// Deliberately narrow: catches real contact details leaking into a template.
const PII = [
  { re: /\b[\w.+-]+@(?!error404\.net\b)[\w-]+\.[\w.]{2,}\b/g, what: 'email address' },
  { re: /\b(?:\+?1[-. ]?)?\(?\d{3}\)?[-. ]\d{3}[-. ]\d{4}\b/g, what: 'phone number' },
];

const HEDGES = /\b(?:very|really|quite|somewhat|fairly|rather|just|simply|basically|actually|essentially|literally)\b/gi;

function sentences(text) {
  return text
    .replace(/```[\s\S]*?```/g, ' ')            // ignore fenced code
    .replace(/`[^`]*`/g, ' ')                    // ignore inline code
    .split(/(?<=[.!?])\s+(?=[A-Z"'(])/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function lintCopy(text, { context = 'instructional' } = {}) {
  const findings = [];
  const add = (severity, rule, message, excerpt) =>
    findings.push({ severity, rule, message, excerpt: excerpt?.slice(0, 120) });

  // 1. Fixed terminology
  for (const t of TERMS) {
    for (const m of text.matchAll(t.bad)) {
      add(t.severity || 'error', 'terminology', `"${m[0].trim()}" → use ${t.good}. ${t.why}`, m[0]);
    }
  }

  // 2. Real contact details in template copy
  for (const p of PII) {
    for (const m of text.matchAll(p.re)) {
      add('error', 'pii', `Looks like a real ${p.what}. Templates and published copy use placeholder tokens only.`, m[0]);
    }
  }

  // 3. Sentence length (STE: one idea per sentence, aim under 25 words)
  for (const s of sentences(text)) {
    const words = s.split(/\s+/).filter(Boolean).length;
    if (words > 35) add('error', 'sentence-length', `${words} words. Split it — STE targets under 25.`, s);
    else if (words > 25) add('warn', 'sentence-length', `${words} words. Consider splitting.`, s);
  }

  // 4. Em-dash chaining — the specific defect found across the guidelines pages
  for (const s of sentences(text)) {
    const dashes = (s.match(/—|--/g) || []).length;
    if (dashes >= 2) {
      add('warn', 'em-dash-chain', `${dashes} em dashes in one sentence. Chained clauses read as one long idea; make them separate sentences.`, s);
    }
  }

  // 5. Second person in published copy
  if (context === 'published' || context === 'instructional') {
    for (const m of text.matchAll(/\b(?:you|your|yours)\b/gi)) {
      add('warn', 'voice', 'Published copy is impersonal or imperative. "you/your" addressing the owner reads as a private note.', m[0]);
    }
  }

  // 6. Passive voice (heuristic)
  for (const m of text.matchAll(/\b(?:is|are|was|were|be|been|being)\s+(\w+ed|built|shown|made|done|given|set|used|kept|held)\b/gi)) {
    add('info', 'passive-voice', 'Possible passive voice. STE prefers active. Verify — some of these are correct.', m[0]);
  }

  // 7. Hedges and filler
  for (const m of text.matchAll(HEDGES)) {
    add('info', 'filler', `"${m[0]}" usually carries no meaning. Consider cutting.`, m[0]);
  }

  const counts = findings.reduce((a, f) => ((a[f.severity] = (a[f.severity] || 0) + 1), a), {});
  return {
    ok: !findings.some((f) => f.severity === 'error'),
    counts: { error: counts.error || 0, warn: counts.warn || 0, info: counts.info || 0 },
    findings,
    note: 'Heuristic. Terminology and PII findings are reliable; sentence, voice and passive findings need human judgement. The tagline and flavour copy are exempt from all of these.',
  };
}
