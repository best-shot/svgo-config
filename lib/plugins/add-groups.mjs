function is(node, parentNode, params) {
  return (
    node.name === params.name &&
    (params.match ? params.match(node) : true) &&
    !(
      parentNode.name === 'g' &&
      (params.match ? params.match(parentNode) : true)
    )
  );
}

export const name = 'addGroups';

export const fn = (_, params) => {
  const io = new Set();

  return {
    element: {
      enter(node, parentNode) {
        if (is(node, parentNode, params)) {
          io.add({ ...node });
        }
      },
      exit(node, parentNode) {
        if (is(node, parentNode, params)) {
          parentNode.children = parentNode.children.filter(
            (child) => child !== node,
          );
        }
      },
    },
    root: {
      enter() {
        io.clear();
      },
      exit(node) {
        if (io.size > 0) {
          const newNode = {
            type: 'element',
            name: 'g',
            attributes: {},
            children: [...io],
          };

          if (params.before) {
            node.children[0].children.splice(1, 0, newNode);
          } else {
            node.children[0].children.push(newNode);
          }

          io.clear();
        }
      },
    },
  };
};
