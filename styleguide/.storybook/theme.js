import { create } from 'storybook/theming';

// The Storybook UI itself is an Error404 surface, so it uses the brand tokens
// rather than default Storybook chrome. Values mirror DESIGN.md section 1.
export default create({
  base: 'dark',
  brandTitle: 'ERROR404.NET — brand system',
  brandUrl: 'https://branding.error404.net',
  brandTarget: '_self',

  colorPrimary: '#4DE1FF',
  colorSecondary: '#FF5FA2',

  appBg: '#170C38',
  appContentBg: '#231451',
  appPreviewBg: '#231451',
  appBorderColor: '#4DE1FF33',
  appBorderRadius: 2,

  textColor: '#F4F1FF',
  textInverseColor: '#170C38',
  textMutedColor: '#8A83B8',

  barTextColor: '#C9C3EF',
  barSelectedColor: '#4DE1FF',
  barHoverColor: '#37F0A6',
  barBg: '#1C1044',

  inputBg: '#1C1044',
  inputBorder: '#4DE1FF33',
  inputTextColor: '#F4F1FF',
  inputBorderRadius: 2,

  fontBase: '"JetBrains Mono", ui-monospace, monospace',
  fontCode: '"JetBrains Mono", ui-monospace, monospace',
});
