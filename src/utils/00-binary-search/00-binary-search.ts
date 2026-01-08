// 0. Basic binary search
// =========================================================

const binarySearch = (nums: number[], target: number) => {
  let start = 0;
  let end = nums.length - 1;

  while (start <= end) {
    const pivot = start + Math.floor((end - start) / 2);
    if (nums[pivot] === target) {
      return pivot;
    } else if (nums[pivot] > target) {
      end = pivot - 1;
    } else {
      start = pivot + 1;
    }
  }

  return -1;
};

// 1. Binary search for the first occurrence
// =========================================================

const binarySearchFirstOccurrence = (nums: number[], target: number) => {
  let start = 0;
  let end = nums.length - 1;

  let result = -1;
  while (start <= end) {
    const pivot = start + Math.floor((end - start) / 2);
    if (nums[pivot] === target) {
      result = pivot;
      end = pivot - 1;
    } else if (nums[pivot] > target) {
      end = pivot - 1;
    } else {
      start = pivot + 1;
    }
  }

  return result;
};

// 2. Recursive basic binary search
// =========================================================

const binarySearchRec = (nums: number[], target: number) => {
  const _binarySearchRec = (
    nums: number[],
    target: number,
    start: number,
    end: number,
  ) => {
    if (start > end) {
      return -1;
    }
    const pivot = start + Math.floor((end - start) / 2);
    if (nums[pivot] === target) {
      return pivot;
    } else if (nums[pivot] > target) {
      return _binarySearchRec(nums, target, start, pivot - 1);
    } else {
      return _binarySearchRec(nums, target, pivot + 1, end);
    }
  };

  return _binarySearchRec(nums, target, 0, nums.length - 1);
};

// 3. Recursive binary search for the first occurrence
// =========================================================

const binarySearchRecFirstOccurrence = (nums: number[], target: number) => {
  const _binarySearchRec = (
    nums: number[],
    target: number,
    start: number,
    end: number,
    result: number,
  ) => {
    if (start > end) {
      return result;
    }
    const pivot = start + Math.floor((end - start) / 2);
    if (nums[pivot] === target) {
      result = pivot;
      return _binarySearchRec(nums, target, start, pivot - 1, result);
    } else if (nums[pivot] > target) {
      return _binarySearchRec(nums, target, start, pivot - 1, result);
    } else {
      return _binarySearchRec(nums, target, pivot + 1, end, result);
    }
  };

  return _binarySearchRec(nums, target, 0, nums.length - 1, -1);
};

// 4. Binary search for the first occurrence (type safe)
// =========================================================

function binarySearchFirstOccurrenceTypeSafe<T>(
  items: T[],
  matcher: (item: T) => 0 | 1 | -1,
) {
  let start = 0;
  let end = items.length - 1;

  let result = -1;
  while (start <= end) {
    const pivot = start + Math.floor((end - start) / 2);
    const match = matcher(items[pivot]);
    if (match === 0) {
      result = pivot;
      end = pivot - 1;
    } else if (match === 1) {
      end = pivot - 1;
    } else {
      start = pivot + 1;
    }
  }

  return result;
}

export {
  binarySearch,
  binarySearchRec,
  binarySearchFirstOccurrence,
  binarySearchRecFirstOccurrence,
  binarySearchFirstOccurrenceTypeSafe,
};
