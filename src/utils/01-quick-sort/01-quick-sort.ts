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
  // choose the pivot
  const pivot = arr[end];

  // index of a smaller element and indicates
  // the right position of the pivot found so far
  let smallerBoundary = start - 1;

  // traverse arr[low..high] and move all smaller
  // elements to the left side. Elements from low to
  // i are smaller after every iteration
  for (let j = start; j <= end - 1; j++) {
    if (arr[j] < pivot) {
      smallerBoundary++;
      swap(arr, smallerBoundary, j);
    }
  }

  // move pivot after smaller elements and
  // return its position
  swap(arr, smallerBoundary + 1, end);
  return smallerBoundary + 1;
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
    // pi is the partition return index of a pivot
    const pi = partition(arr, start, end);

    // recursion calls for smaller elements
    // and greater or equals elements
    quickSortHelper(arr, start, pi - 1);
    quickSortHelper(arr, pi + 1, end);
  }
  return arr;
}

const quickSort = (_arr: number[]) => {
  const arr = _arr.slice();
  return quickSortHelper(arr, 0, arr.length - 1);
};

export { quickSortNaive, quickSort };
