// 0. Selection sort
const selectionSort = (nums: number[]) => {
  const result: number[] = [];

  while (nums.length) {
    let min = Infinity;
    let minIdx = -1;
    for (let i = 0; i < nums.length; i++) {
      if (nums[i] < min) {
        min = nums[i];
        minIdx = i;
      }
    }
    result.push(min);
    nums.splice(minIdx, 1);
  }

  return result;
};

console.log(selectionSort([3, 1, 2]));
