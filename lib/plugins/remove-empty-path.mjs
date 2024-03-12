export const name = 'removeEmptyPath';

function is(node) {
  return (
    node.name === 'path' &&
    (node.attributes.fill === 'none' ||
      node.attributes.fill === 'transparent') &&
    !node.attributes.stroke
  );
}

export const fn = () => {
  return {
    element: {
      enter: (node) => {
        if (node.attributes.fill === 'transparent') {
          node.attributes.fill = 'none';
        }

        if (node.attributes.stroke) {
          node.attributes.fill ||= 'none';
        }
      },
      exit(node, parentNode) {
        if (is(node)) {
          parentNode.children = parentNode.children.filter(
            (child) => child !== node,
          );
        }
      },
    },
  };
};
