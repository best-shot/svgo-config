export default {
  multipass: true,
  plugins: [
    {
      name: 'preset-default',
    },
    {
      name: 'removeAttributesBySelector',
      params: {
        selector: 'svg',
        attributes: ['xml:space', 'id'],
      },
    },
    {
      name: 'sortAttrs',
    },
    {
      name: 'removeAttrs',
      params: {
        attrs: ['data-*', 'data.*'],
      },
    },
    {
      name: 'removeDimensions',
    },
    {
      name: 'convertStyleToAttrs',
      params: {
        keepImportant: true,
      },
    },
  ],
};
