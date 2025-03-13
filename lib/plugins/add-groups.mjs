function is(node, parentNode, { name, match, into }) {
  return (
    node.name === name &&
    (match ? match(node) : true) &&
    !(parentNode.name === into && (match ? match(parentNode) : true))
  );
}

export const fn = (
  _,
  { before = false, into = 'g', match, name, attributes = {} },
) => {
  const io = new Set();

  return {
    element: {
      enter(node, parentNode) {
        if (is(node, parentNode, { name, match, into })) {
          io.add({ node: { ...node }, parent: parentNode });
        }
      },
      exit(node, parentNode) {
        if (is(node, parentNode, { name, match, into })) {
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
              name: into,
              attributes,
              children: newNodes.map((item) => item.node),
            };

            if (before) {
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

export const name = 'addGroups';
