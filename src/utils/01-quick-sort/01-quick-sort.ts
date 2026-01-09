const quickSortNaive = (nums: number[]): number[] => {
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
  return [...quickSortNaive(smaller), nums[pivot], ...quickSortNaive(larger)];
};

// partition function
function partition(arr: number[], start: number, end: number) {
  // choose the pivot value (last element)
  const pivotValue = arr[end];

  // index of the last element smaller than pivot;
  // indicates the right position of the pivot found so far
  let lastSmallerIndex = start - 1;

  // traverse arr[start..end] and move all smaller
  // elements to the left side. Elements from start to
  // lastSmallerIndex are smaller after every iteration
  for (let j = start; j <= end - 1; j++) {
    if (arr[j] < pivotValue) {
      lastSmallerIndex++;
      swap(arr, lastSmallerIndex, j);
    }
  }

  // move pivot after smaller elements and
  // return its position
  swap(arr, lastSmallerIndex + 1, end);
  return lastSmallerIndex + 1;
}

// swap function
function swap(arr: number[], i: number, j: number) {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

// the QuickSort function implementation
function quickSortHelper(arr: number[], start: number, end: number) {
  if (start < end) {
    // pivotIndex is the final sorted position of the pivot
    const pivotIndex = partition(arr, start, end);

    // recursion calls for smaller elements
    // and greater or equals elements
    quickSortHelper(arr, start, pivotIndex - 1);
    quickSortHelper(arr, pivotIndex + 1, end);
  }
  return arr;
}

const quickSort = (_arr: number[]) => {
  const arr = _arr.slice();
  return quickSortHelper(arr, 0, arr.length - 1);
};

export { quickSortNaive, quickSort };
