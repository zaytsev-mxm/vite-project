const quickSort = (nums: number[]): number[] => {
  if (nums.length < 2) return [...nums];

  const pivot = Math.floor(nums.length / 2);
  const smaller: number[] = [];
  const larger: number[] = [];
  for (let i = 0; i < nums.length; i++) {
    if (i === pivot) continue;
    if (nums[i] <= nums[pivot]) {
      smaller.push(nums[i]);
    } else {
      larger.push(nums[i]);
    }
  }
  return [...quickSort(smaller), nums[pivot], ...quickSort(larger)];
};

export { quickSort };
