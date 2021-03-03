const { extendDefaultPlugins } = require('svgo');

module.exports = {
  multipass: true,
  plugins: extendDefaultPlugins([
    { name: 'removeDimensions' },
    {
      name: 'convertPathData',
      params: {
        noSpaceAfterFlags: false,
      },
    },
    {
      name: 'inlineStyles',
      params: {
        onlyMatchedOnce: false,
      },
    },
    {
      name: 'removeAttrs',
      params: {
        attrs: ['data-*', 'data.*'],
      },
    },
    {
      name: 'removeAttributesBySelector',
      params: {
        selector: 'svg',
        attributes: ['xml:space', 'id'],
      },
    },
    { name: 'sortAttrs' },
    { name: 'removeScriptElement' },
    { name: 'removeStyleElement' },
  ]),
};
