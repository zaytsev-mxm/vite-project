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
function partition(arr: number[], low: number, high: number) {
  // choose the pivot
  const pivot = arr[high];

  // index of a smaller element and indicates
  // the right position of the pivot found so far
  let i = low - 1;

  // traverse arr[low..high] and move all smaller
  // elements to the left side. Elements from low to
  // i are smaller after every iteration
  for (let j = low; j <= high - 1; j++) {
    if (arr[j] < pivot) {
      i++;
      swap(arr, i, j);
    }
  }

  // move pivot after smaller elements and
  // return its position
  swap(arr, i + 1, high);
  return i + 1;
}

// swap function
function swap(arr: number[], i: number, j: number) {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

// the QuickSort function implementation
function quickSortHelper(arr: number[], low: number, high: number) {
  if (low < high) {
    // pi is the partition return index of a pivot
    const pi = partition(arr, low, high);

    // recursion calls for smaller elements
    // and greater or equals elements
    quickSortHelper(arr, low, pi - 1);
    quickSortHelper(arr, pi + 1, high);
  }
  return arr;
}

const quickSort = (_arr: number[]) => {
  const arr = _arr.slice();
  return quickSortHelper(arr, 0, arr.length - 1);
};

export { quickSortNaive, quickSort };
