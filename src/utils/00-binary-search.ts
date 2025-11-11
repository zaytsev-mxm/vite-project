function search(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const pivot = Math.floor((left + right) / 2);

    if (nums[pivot] === target) {
      return pivot;
    } else if (nums[pivot] < target) {
      left = pivot + 1;
    } else {
      right = pivot - 1;
    }
  }

  return -1;
}

const res = search([-1, 0, 3, 5, 9, 12], 9);

console.log(`res = ${res}`);
