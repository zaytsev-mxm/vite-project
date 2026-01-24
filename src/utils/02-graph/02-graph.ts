class TreeNode<T> {
  val: T;

  left: TreeNode<T> | null;

  right: TreeNode<T> | null;

  constructor(params: {
    val: T;
    left?: TreeNode<T> | null;
    right?: TreeNode<T> | null;
  }) {
    this.val = params.val;
    this.left = params.left || null;
    this.right = params.right || null;
  }
}

const tree: TreeNode<number> = new TreeNode({
  val: 1,
  left: new TreeNode({
    val: 2,
    left: new TreeNode({
      val: 4,
      left: new TreeNode({ val: 8 }),
      right: new TreeNode({ val: 9 }),
    }),
    right: new TreeNode({
      val: 5,
      left: new TreeNode({ val: 10 }),
      right: new TreeNode({ val: 11 }),
    }),
  }),
  right: new TreeNode<number>({
    val: 3,
    left: new TreeNode({
      val: 6,
      left: new TreeNode({ val: 12 }),
      right: new TreeNode({ val: 13 }),
    }),
    right: new TreeNode({
      val: 7,
      left: new TreeNode({ val: 14 }),
      right: new TreeNode({ val: 15 }),
    }),
  }),
});

const traverse = (node: TreeNode<number>): TreeNode<number>[] => {
  const res: TreeNode<number>[] = [];
  const stack: TreeNode<number>[] = [node];

  while (stack.length) {
    const cur = stack.shift();

    if (cur) {
      res.push(cur);
      if (cur.left) stack.push(cur.left);
      if (cur.right) stack.push(cur.right);
    }
  }

  return res;
};

const ordered = traverse(tree);

console.log(ordered);
