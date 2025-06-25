'use strict';

module.exports = {
  multipass: true,
  floatPrecision: 4,
  plugins: [
    { name: 'removeTitle' },
    {
      name: 'preset-default',
    },
    {
      name: 'removeAttributesBySelector',
      params: {
        selector: 'svg',
        attributes: ['xml:space', 'id', 'baseProfile'],
      },
    },
    {
      name: 'removeAttrs',
      params: {
        attrs: ['data-*', 'data.*'],
      },
    },
    {
      name: 'convertStyleToAttrs',
      params: {
        keepImportant: true,
      },
    },
    {
      name: 'sortAttrs',
    },
  ],
};
