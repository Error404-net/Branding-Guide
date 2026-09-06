/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: [
    '../src/docs/**/*.mdx',
    '../src/components/**/*.stories.@(js|jsx)',
  ],
  addons: ['@storybook/addon-docs'],
  framework: { name: '@storybook/react-vite', options: {} },
  // Served from a GitHub Pages subpath, so every asset URL must be relative.
  viteFinal: async (cfg) => ({ ...cfg, base: './' }),
};
export default config;
