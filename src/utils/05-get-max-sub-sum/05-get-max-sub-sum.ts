export const getMaxSubSum = (nums: number[]): number => {
  let maxSum: number = -Infinity;

  for (let i = 0; i < nums.length; i++) {
    let curSum = 0;
    for (let j = i; j < nums.length; j++) {
      curSum += nums[j];
      maxSum = Math.max(curSum, maxSum);
    }
  }

  return maxSum;
};

export const getMaxSubSumOn = (nums: number[]): number => {
  let maxSum = -Infinity;
  let partialSum = 0;

  for (const num of nums) {
    partialSum += num;
    maxSum = Math.max(maxSum, partialSum);
    if (partialSum < 0) partialSum = 0;
  }

  return maxSum;
};
