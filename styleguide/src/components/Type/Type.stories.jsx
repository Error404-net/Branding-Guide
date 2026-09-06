import React from 'react';

const SCALE = [
  { token: '--e404-type-h1', size: 34, family: 'VT323, monospace', color: '#F4F1FF', use: 'Page title' },
  { token: '--e404-type-h2', size: 24, family: 'VT323, monospace', color: '#FF5FA2', use: 'Section' },
  { token: '--e404-type-h3', size: 18, family: 'VT323, monospace', color: '#37F0A6', use: 'Subsection' },
  { token: '--e404-type-body', size: 12.5, family: '"JetBrains Mono", monospace', color: '#C9C3EF', use: 'Paragraph, list, cell' },
  { token: '--e404-type-table', size: 11.5, family: '"JetBrains Mono", monospace', color: '#C9C3EF', use: 'Dense table' },
  { token: '--e404-type-caption', size: 11, family: '"JetBrains Mono", monospace', color: '#8A83B8', use: 'Caption, note' },
  { token: '--e404-type-foot', size: 10, family: '"JetBrains Mono", monospace', color: '#8A83B8', use: 'Running footer' },
];

export default {
  title: 'Brand/Typography',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        component:
          'Five roles, one face each, every one with a declared generic fallback. ' +
          '**Always write the fallback.** A family named alone falls back to the browser default ' +
          'serif, not to monospace — that shipped as a real defect, and for several revisions the ' +
          'brand guidelines PDF rendered its own type specimens in Times.',
      },
    },
  },
};

export const Families = {
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      {[
        { face: '"Press Start 2P", monospace', label: 'Press Start 2P — display, hero only, ≥24px', sample: 'ERROR404', size: 22 },
        { face: 'VT323, monospace', label: 'VT323 — terminal, headings and NFO tables', sample: 'root@error404.net', size: 34 },
        { face: '"JetBrains Mono", monospace', label: 'JetBrains Mono — body and UI', sample: 'Sign in to continue', size: 20 },
      ].map((f) => (
        <div key={f.label}>
          <div style={{ font: '11px "JetBrains Mono", monospace', color: '#8A83B8', marginBottom: 8 }}>
            {f.label}
          </div>
          <div style={{ fontFamily: f.face, fontSize: f.size, color: '#F4F1FF' }}>{f.sample}</div>
        </div>
      ))}
    </div>
  ),
};

export const Scale = {
  render: () => (
    <div style={{ display: 'grid', gap: 18 }}>
      {SCALE.map((s) => (
        <div key={s.token} style={{ display: 'flex', gap: 20, alignItems: 'baseline' }}>
          <code style={{ font: '11px "JetBrains Mono", monospace', color: '#4DE1FF', minWidth: 180 }}>
            {s.token}
          </code>
          <span style={{ font: '11px "JetBrains Mono", monospace', color: '#8A83B8', minWidth: 56 }}>
            {s.size}px
          </span>
          <span style={{ fontFamily: s.family, fontSize: s.size, color: s.color, letterSpacing: s.size >= 18 ? 1 : 0 }}>
            {s.use}
          </span>
        </div>
      ))}
    </div>
  ),
};

export const FallbackTrap = {
  name: 'The fallback trap',
  parameters: {
    docs: {
      description: {
        story:
          'Both lines request a font that does not exist. The first declares no generic family and ' +
          'lands on serif. The second declares `monospace` and stays in the right genre. This is ' +
          'the exact defect that shipped in the guidelines PDF.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: 20 }}>
      <div>
        <div style={{ font: '11px "JetBrains Mono", monospace', color: '#FF5FA2', marginBottom: 6 }}>
          ✗ font-family: 'Nonexistent Face'
        </div>
        <div style={{ fontFamily: "'Nonexistent Face'", fontSize: 20, color: '#F4F1FF' }}>
          root@error404.net :: 404
        </div>
      </div>
      <div>
        <div style={{ font: '11px "JetBrains Mono", monospace', color: '#37F0A6', marginBottom: 6 }}>
          ✓ font-family: 'Nonexistent Face', monospace
        </div>
        <div style={{ fontFamily: "'Nonexistent Face', monospace", fontSize: 20, color: '#F4F1FF' }}>
          root@error404.net :: 404
        </div>
      </div>
    </div>
  ),
};
