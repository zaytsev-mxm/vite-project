export const getMaxSubSum = (nums: number[]): number => {
  if (!nums.length) return 0;
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
  if (!nums.length) return 0;
  let maxSum = -Infinity;
  let partialSum = 0;

  for (const num of nums) {
    partialSum += num;
    maxSum = Math.max(maxSum, partialSum);
    if (partialSum < 0) partialSum = 0;
  }

  return maxSum;
};

export const getMaxSubSumOnWithIndexes = (
  nums: number[],
): [number, [number, number]] => {
  if (!nums.length) return [0, [0, 0]];
  let maxSum = -Infinity;
  let partialSum = 0;
  let start = 0;
  let tempStart = 0;
  let end = 0;
  let i = 0;

  for (const num of nums) {
    partialSum += num;

    if (partialSum > maxSum) {
      maxSum = partialSum;
      start = tempStart;
      end = i;
    }

    if (partialSum < 0) {
      partialSum = 0;
      tempStart = i + 1;
    }

    i++;
  }

  return [maxSum, [start, end]];
};
