import React from 'react';
import { Swatch, ContrastTable } from './Swatch';

const SURFACES = [
  { name: 'Background', token: '--e404-surface', hex: '#231451', meaning: 'Primary surface' },
  { name: 'Deep background', token: '--e404-surface-deep', hex: '#170C38', meaning: 'Page shell, load fallback' },
  { name: 'Raised', token: '--e404-surface-raised', hex: '#1C1044', meaning: 'Boxes, table headers' },
];

const TEXT = [
  { name: 'Strong', token: '--e404-text-strong', hex: '#F4F1FF', meaning: 'Headings' },
  { name: 'Body', token: '--e404-text-body', hex: '#E8E4FF', meaning: 'Default body' },
  { name: 'Muted', token: '--e404-text-muted', hex: '#C9C3EF', meaning: 'Paragraphs, cells' },
  { name: 'Subtle', token: '--e404-text-subtle', hex: '#8A83B8', meaning: 'Captions, notes' },
];

const ACCENTS = [
  { name: 'Blue', token: '--e404-accent-primary', hex: '#4DE1FF', meaning: 'Links, primary actions' },
  { name: 'Pink', token: '--e404-accent-secondary', hex: '#FF5FA2', meaning: 'Highlights, 2nd glitch layer' },
  { name: 'Yellow', token: '--e404-accent-emphasis', hex: '#FFE156', meaning: 'Taglines, callouts, CTAs' },
  { name: 'Mint', token: '--e404-accent-status', hex: '#37F0A6', meaning: 'Rules, dividers, status' },
];

export default {
  title: 'Brand/Color',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The **Arcade New Wave** palette is locked. It was sampled from an arcade reference ' +
          'image, not generated. Each accent carries one fixed meaning on every surface — do not ' +
          'reassign one to suit a layout. Use at most two accents per surface.',
      },
    },
  },
};

const Row = ({ items }) => (
  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
    {items.map((s) => <Swatch key={s.hex} {...s} />)}
  </div>
);

export const Surfaces = { render: () => <Row items={SURFACES} /> };
export const TextRamp = {
  name: 'Text ramp',
  parameters: {
    docs: {
      description: {
        story:
          'Four foreground tones, not one. BRAND.md documents only `#F4F1FF`, since that is the ' +
          'identity color; the rest are surface-layer derivations and live in DESIGN.md.',
      },
    },
  },
  render: () => <Row items={TEXT} />,
};
export const Accents = { render: () => <Row items={ACCENTS} /> };

export const Contrast = {
  parameters: {
    docs: {
      description: {
        story:
          'Computed live from the token values via WCAG 2.1, so these numbers cannot drift from ' +
          'the palette. **The footer token `#655E93` fails at 2.77:1** — below even the 3:1 ' +
          'large-text floor — and is shown here for comparison. The fix is to reuse ' +
          '`--e404-text-subtle`.',
      },
    },
  },
  render: () => (
    <ContrastTable
      foregrounds={[
        ...TEXT, ...ACCENTS,
        { name: 'PDF footer (defect)', token: '#655E93 — defect', hex: '#655E93' },
      ]}
      backgrounds={SURFACES}
    />
  ),
};

export const PrintCorporate = {
  name: 'Print / Corporate',
  parameters: {
    backgrounds: { value: 'print' },
    docs: {
      description: {
        story: 'Print/Corporate mode uses none of the palette. Pure black on white, 21:1.',
      },
    },
  },
  render: () => (
    <Row
      items={[
        { name: 'Paper', hex: '#FFFFFF', meaning: 'Surface' },
        { name: 'Ink', hex: '#000000', meaning: 'All text and rules' },
      ]}
    />
  ),
};
