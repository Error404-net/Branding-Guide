import '../src/tokens.css';
import theme from './theme';

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  parameters: {
    docs: { theme },
    controls: { matchers: { color: /(background|color)$/i } },
    backgrounds: {
      options: {
        surface: { name: 'Surface', value: '#231451' },
        deep: { name: 'Surface deep', value: '#170C38' },
        raised: { name: 'Surface raised', value: '#1C1044' },
        // Print/Corporate mode is a real brand surface, not a debug view.
        print: { name: 'Print / Corporate', value: '#FFFFFF' },
      },
    },
  },
  initialGlobals: { backgrounds: { value: 'surface' } },
};

export default preview;
