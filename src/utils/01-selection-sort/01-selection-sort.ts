// 0. Selection sort
const selectionSort = (numsGiven: number[]) => {
  const nums = numsGiven.slice();

  for (let i = 0; i < nums.length; i++) {
    let minIdx = i;
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[j] < nums[minIdx]) {
        minIdx = j;
      }
    }
    [nums[i], nums[minIdx]] = [nums[minIdx], nums[i]];
  }

  return nums;
};

function selectionSortTypeSafe<T>(
  arrGiven: T[],
  matcher: (itemA: T, itemB: T) => 0 | 1 | -1,
) {
  const arr = arrGiven.slice();

  for (let i = 0; i < arr.length; i++) {
    let minIdx = i;
    for (let j = i + 1; j < arr.length; j++) {
      const match = matcher(arr[j], arr[minIdx]);
      if (match < 0) {
        minIdx = j;
      }
    }
    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
  }

  return arr;
}

export { selectionSort, selectionSortTypeSafe };
