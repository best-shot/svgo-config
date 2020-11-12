module.exports = {
  multipass: true,
  plugins: [
    { removeDimensions: true },
    {
      convertPathData: {
        noSpaceAfterFlags: false,
      },
    },
    {
      inlineStyles: {
        onlyMatchedOnce: false,
      },
    },
    {
      removeAttrs: {
        attrs: ['data-*', 'data.*'],
      },
    },
    {
      removeAttributesBySelector: {
        selector: 'svg',
        attributes: ['xml:space', 'id'],
      },
    },
    { sortAttrs: true },
    { removeScriptElement: true },
    { removeStyleElement: true },
  ],
};
