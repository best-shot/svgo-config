/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
/* eslint-disable eqeqeq */
import { collectStylesheet, computeStyle } from 'svgo/lib/style.js';
import { removeLeadingZero } from 'svgo/lib/svgo/tools.js';
import { attrsGroupsDefaults } from 'svgo/plugins/_collections.js';
import { transform2js, transformsMultiply } from 'svgo/plugins/_transforms.js';

export const name = 'applyTransformsShapes';

export const description = 'Applies transforms to some shapes.';

const APPLICABLE_SHAPES = ['circle', 'ellipse', 'rect', 'image', 'text'];

/**
 * @typedef {number[]} Matrix
 */

/**
 * Applies transforms to some shapes.
 *
 * @author Kendell R
 *
 * @type {import('./plugins-types.js').Plugin<'applyTransformsShapes'>}
 */
export const fn = (root, params) => {
  const { floatPrecision = 3, leadingZero = true } = params;
  const factor = 10 ** floatPrecision;
  const stylesheet = collectStylesheet(root);

  return {
    element: {
      enter: (node) => {
        if (!APPLICABLE_SHAPES.includes(node.name)) {
          return;
        }

        const computedStyle = computeStyle(stylesheet, node);

        if (computedStyle.filter) {
          return;
        }

        if (
          computedStyle.stroke?.type === 'dynamic' ||
          computedStyle['stroke-width']?.type === 'dynamic'
        ) {
          return;
        }

        const transformStyle = computedStyle.transform;

        if (
          transformStyle?.type !== 'static' ||
          transformStyle.value !== node.attributes.transform
        ) {
          return;
        }

        const matrix = transformsMultiply(
          transform2js(node.attributes.transform),
        );
        const hasStroke =
          computedStyle.stroke && computedStyle.stroke.value !== 'none';
        const strokeWidth = Number(
          computedStyle['stroke-width']?.value ||
            (hasStroke && attrsGroupsDefaults.presentation['stroke-width']),
        );

        const isSimilar =
          (matrix.data[0] === matrix.data[3] &&
            matrix.data[1] === -matrix.data[2]) ||
          (matrix.data[0] === -matrix.data[3] &&
            matrix.data[1] === matrix.data[2]);
        const isLinear =
          (matrix.data[0] != 0 &&
            matrix.data[1] == 0 &&
            matrix.data[2] == 0 &&
            matrix.data[3] != 0) ||
          (matrix.data[0] == 0 &&
            matrix.data[1] != 0 &&
            matrix.data[2] != 0 &&
            matrix.data[3] == 0);
        const isTranslation =
          matrix.data[0] == 1 &&
          matrix.data[1] == 0 &&
          matrix.data[2] == 0 &&
          matrix.data[3] == 1;
        const scale = Math.hypot(matrix.data[0], matrix.data[1]);

        if (node.name == 'circle') {
          if (!isSimilar) {
            return;
          }

          const cx = Number(node.attributes.cx || '0');
          const cy = Number(node.attributes.cy || '0');
          const r = Number(node.attributes.r || '0');

          const newCenter = transformAbsolutePoint(matrix.data, cx, cy);

          if (strokeWidth) {
            node.attributes['stroke-width'] = stringifyNumber(
              strokeWidth * scale,
              factor,
              leadingZero,
            );
          }

          node.attributes.cx = stringifyNumber(
            newCenter[0],
            factor,
            leadingZero,
          );
          node.attributes.cy = stringifyNumber(
            newCenter[1],
            factor,
            leadingZero,
          );
          node.attributes.r = stringifyNumber(r * scale, factor, leadingZero);
          delete node.attributes.transform;
        } else if (node.name == 'ellipse') {
          if (!isLinear) {
            return;
          }

          if (strokeWidth && !isSimilar) {
            return;
          }

          const cx = Number(node.attributes.cx || '0');
          const cy = Number(node.attributes.cy || '0');
          const rx = Number(node.attributes.rx || '0');
          const ry = Number(node.attributes.ry || '0');

          const newCenter = transformAbsolutePoint(matrix.data, cx, cy);
          const [newRx, newRy] = transformSize(matrix.data, rx, ry);

          if (strokeWidth) {
            node.attributes['stroke-width'] = stringifyNumber(
              strokeWidth * scale,
              factor,
              leadingZero,
            );
          }

          node.attributes.cx = stringifyNumber(
            newCenter[0],
            factor,
            leadingZero,
          );
          node.attributes.cy = stringifyNumber(
            newCenter[1],
            factor,
            leadingZero,
          );
          node.attributes.rx = stringifyNumber(newRx, factor, leadingZero);
          node.attributes.ry = stringifyNumber(newRy, factor, leadingZero);
          delete node.attributes.transform;
        } else if (node.name == 'rect') {
          if (!isLinear) {
            return;
          }

          if (strokeWidth && !isSimilar) {
            return;
          }

          const x = Number(node.attributes.x || '0');
          const y = Number(node.attributes.y || '0');
          const width = Number(node.attributes.width || '0');
          const height = Number(node.attributes.height || '0');
          let rx = node.attributes.rx ? Number(node.attributes.rx) : Number.NaN;
          let ry = node.attributes.ry ? Number(node.attributes.ry) : Number.NaN;
          rx = Number.isNaN(rx) ? ry || 0 : rx;
          ry = Number.isNaN(ry) ? rx || 0 : ry;

          const cornerA = transformAbsolutePoint(matrix.data, x, y);
          const cornerB = transformAbsolutePoint(
            matrix.data,
            x + width,
            y + height,
          );
          const cornerX = Math.min(cornerA[0], cornerB[0]);
          const cornerY = Math.min(cornerA[1], cornerB[1]);
          const [newW, newH] = transformSize(matrix.data, width, height);
          const [newRx, newRy] = transformSize(matrix.data, rx, ry);

          if (strokeWidth) {
            node.attributes['stroke-width'] = stringifyNumber(
              strokeWidth * scale,
              factor,
              leadingZero,
            );
          }

          node.attributes.x = stringifyNumber(cornerX, factor, leadingZero);
          node.attributes.y = stringifyNumber(cornerY, factor, leadingZero);
          node.attributes.width = stringifyNumber(newW, factor, leadingZero);
          node.attributes.height = stringifyNumber(newH, factor, leadingZero);

          if (newRx < 1 / factor && newRy < 1 / factor) {
            delete node.attributes.rx;
            delete node.attributes.ry;
          } else if (Math.abs(newRx - newRy) < 1 / factor) {
            node.attributes.rx = stringifyNumber(newRx, factor, leadingZero);
            delete node.attributes.ry;
          } else {
            node.attributes.rx = stringifyNumber(newRx, factor, leadingZero);
            node.attributes.ry = stringifyNumber(newRy, factor, leadingZero);
          }

          delete node.attributes.transform;
        } else if (node.name == 'image' || node.name == 'text') {
          if (!isTranslation) {
            return;
          }

          const x = Number(node.attributes.x || '0');
          const y = Number(node.attributes.y || '0');
          const corner = transformAbsolutePoint(matrix.data, x, y);

          node.attributes.x = stringifyNumber(corner[0], factor, leadingZero);
          node.attributes.y = stringifyNumber(corner[1], factor, leadingZero);
          delete node.attributes.transform;
        }
      },
    },
  };
};

/**
 * @param {Matrix} matrix
 * @param {number} x
 * @param {number} y
 */
const transformAbsolutePoint = (matrix, x, y) => {
  const newX = matrix[0] * x + matrix[2] * y + matrix[4];
  const newY = matrix[1] * x + matrix[3] * y + matrix[5];

  return [newX, newY];
};

/**
 * @param {Matrix} matrix
 * @param {number} w
 * @param {number} h
 */
const transformSize = (matrix, w, h) => {
  const newW = matrix[0] * w + matrix[1] * h;
  const newH = matrix[2] * w + matrix[3] * h;

  return [Math.abs(newW), Math.abs(newH)];
};

/**
 * @param {number} number
 * @param {number} factor
 * @param {boolean} leadingZero
 */
const stringifyNumber = (number, factor, leadingZero) => {
  const rounded = Math.round(number * factor) / factor;

  return leadingZero ? removeLeadingZero(rounded) : rounded.toString();
};
