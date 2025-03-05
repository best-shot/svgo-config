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
          io.add({ node: { ...node }, parent: parentNode });
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
      exit() {
        if (io.size > 0) {
          const sets = Map.groupBy(io, (item) => item.parent);

          for (const [parentNode, newNodes] of sets.entries()) {
            const newGroup = {
              type: 'element',
              name: 'g',
              attributes: {},
              children: newNodes.map((item) => item.node),
            };

            if (params.before) {
              parentNode.children.splice(1, 0, newGroup);
            } else {
              parentNode.children.push(newGroup);
            }
          }

          io.clear();
        }
      },
    },
  };
};
