import React from 'react';
import { contrast, rating } from '../../lib/contrast';

const mono = '"JetBrains Mono", monospace';

/** One palette entry: chip, role token, hex, and its fixed meaning. */
export function Swatch({ name, token, hex, meaning, width = 150 }) {
  return (
    <figure style={{ margin: 0, width }}>
      <div
        style={{
          height: 76, background: hex, borderRadius: 2,
          border: '1px solid rgba(255,255,255,0.15)',
        }}
      />
      <figcaption style={{ font: `11px ${mono}`, marginTop: 8, lineHeight: 1.5 }}>
        <div style={{ color: '#F4F1FF' }}>{name}</div>
        <div style={{ color: '#8A83B8' }}>{hex.toUpperCase()}</div>
        {token && <div style={{ color: '#4DE1FF' }}>{token}</div>}
        {meaning && <div style={{ color: '#C9C3EF', marginTop: 4 }}>{meaning}</div>}
      </figcaption>
    </figure>
  );
}

/**
 * Contrast table. Ratios are computed from the values passed in, so editing a
 * token changes the reported number rather than leaving a stale one behind.
 */
export function ContrastTable({ foregrounds, backgrounds }) {
  const cell = { padding: '6px 12px', border: '1px solid #4DE1FF33', font: `11.5px ${mono}` };
  return (
    <table style={{ borderCollapse: 'collapse', color: '#C9C3EF' }}>
      <thead>
        <tr>
          <th style={{ ...cell, color: '#F4F1FF', textAlign: 'left' }}>Token</th>
          {backgrounds.map((b) => (
            <th key={b.hex} style={{ ...cell, color: '#F4F1FF', textAlign: 'left' }}>
              on {b.hex}
            </th>
          ))}
          <th style={{ ...cell, color: '#F4F1FF', textAlign: 'left' }}>Normal text</th>
        </tr>
      </thead>
      <tbody>
        {foregrounds.map((f) => {
          const ratios = backgrounds.map((b) => contrast(f.hex, b.hex));
          const worst = rating(Math.min(...ratios));
          return (
            <tr key={f.hex}>
              <td style={{ ...cell, color: f.hex }}>{f.token ?? f.name}</td>
              {ratios.map((r, i) => (
                <td key={i} style={cell}>{r.toFixed(2)}:1</td>
              ))}
              <td style={{ ...cell, color: worst.ok ? '#37F0A6' : '#FF5FA2', fontWeight: 700 }}>
                {worst.label}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default Swatch;
