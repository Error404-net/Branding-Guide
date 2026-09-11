import React from 'react';
import { Mark } from './Mark';
import { STARS } from './libraData';

export default {
  title: 'Brand/Mark',
  component: Mark,
  parameters: {
    docs: {
      description: {
        component:
          'The Libra constellation mark, the Error404 primary mark. It is drawn from the same ' +
          'geometry as the shipping SVG masters: node positions come from real right ascension ' +
          'and declination, and each node radius is scaled to that star’s real apparent ' +
          'magnitude, so brighter stars render larger. The "4Ø4" numerals are universal across ' +
          'every cut. Turn on **showStarNames** to see which star each node is.',
      },
    },
  },
  argTypes: {
    colorway: {
      control: 'inline-radio',
      options: ['multicolor', 'blue', 'pink', 'green', 'white', 'black'],
      description: 'Palette variant. `black` is the Print/Corporate cut.',
    },
    ring: { control: 'boolean', description: 'Enclosing ring' },
    glyphOnly: { control: 'boolean', description: 'Drop the numerals (favicon sizes)' },
    showStarNames: { control: 'boolean', description: 'Label each node with its Bayer designation' },
    size: { control: { type: 'range', min: 16, max: 512, step: 8 } },
  },
  args: { colorway: 'multicolor', ring: true, glyphOnly: false, showStarNames: false, size: 240 },
};

export const Playground = {};

export const Colorways = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-end' }}>
      {['multicolor', 'blue', 'pink', 'green', 'white'].map((cw) => (
        <figure key={cw} style={{ margin: 0, textAlign: 'center' }}>
          <Mark colorway={cw} size={120} />
          <figcaption style={{ font: '11px "JetBrains Mono", monospace', color: '#C9C3EF', marginTop: 8 }}>
            {cw}
          </figcaption>
        </figure>
      ))}
    </div>
  ),
};

export const RingAndNoRing = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: 28, alignItems: 'flex-end' }}>
      {[true, false].map((r) => (
        <figure key={String(r)} style={{ margin: 0, textAlign: 'center' }}>
          <Mark ring={r} size={140} />
          <figcaption style={{ font: '11px "JetBrains Mono", monospace', color: '#C9C3EF', marginTop: 8 }}>
            {r ? 'ring' : 'no ring'}
          </figcaption>
        </figure>
      ))}
    </div>
  ),
};

export const SizeReduction = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Minimum size is 24px for the flat variant. Below roughly 48px the numerals stop ' +
          'resolving, which is why the favicon sizes use the glyph-only cut instead.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-end' }}>
      {[128, 64, 48, 32, 24, 16].map((s) => (
        <figure key={s} style={{ margin: 0, textAlign: 'center' }}>
          <Mark size={s} ring={false} />
          <figcaption style={{ font: '10px "JetBrains Mono", monospace', color: '#8A83B8', marginTop: 8 }}>
            {s}px
          </figcaption>
        </figure>
      ))}
    </div>
  ),
};

export const GlyphOnly = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Numerals dropped. Used for the 16, 32, and 48px favicon sizes, where they are unreadable.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-end' }}>
      {[64, 48, 32, 16].map((s) => (
        <Mark key={s} size={s} glyphOnly ring={false} />
      ))}
    </div>
  ),
};

export const PrintCorporate = {
  parameters: {
    controls: { disable: true },
    backgrounds: { value: 'print' },
    docs: {
      description: {
        story: 'The Print/Corporate cut: flat monochrome on white. No color, no glow, no offset layers.',
      },
    },
  },
  render: () => <Mark colorway="black" size={200} />,
};

export const StarData = {
  name: 'Star data',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'The six stars behind the mark. Node radius is inversely proportional to apparent magnitude.',
      },
    },
  },
  render: () => (
    // Star labels are pushed outside the 240 viewBox, so the container needs
    // padding or they clip against the canvas edge.
    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap', padding: '16px 48px' }}>
      <Mark size={260} showStarNames />
      <table style={{ font: '12px "JetBrains Mono", monospace', color: '#C9C3EF', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {['Star', 'Bayer', 'Mag', 'Node r'].map((h) => (
              <th key={h} style={{ textAlign: 'left', padding: '6px 12px', border: '1px solid #4DE1FF33', color: '#F4F1FF' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...STARS].sort((a, b) => a.mag - b.mag).map((s) => (
            <tr key={s.id}>
              <td style={{ padding: '6px 12px', border: '1px solid #4DE1FF33' }}>{s.name}</td>
              <td style={{ padding: '6px 12px', border: '1px solid #4DE1FF33' }}>{s.bayer}</td>
              <td style={{ padding: '6px 12px', border: '1px solid #4DE1FF33' }}>{s.mag}</td>
              <td style={{ padding: '6px 12px', border: '1px solid #4DE1FF33' }}>{s.r}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};
