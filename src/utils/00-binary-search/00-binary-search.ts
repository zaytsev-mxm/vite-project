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

export function binarySearch<T>(
  arr: Array<T>,
  predicate: (item: T) => boolean,
): number {
  let start = 0;
  let end = arr.length - 1;
  while (start < end) {
    const pivot = Math.floor((end + start) / 2);
    const el = arr[pivot];
    const prevEl = arr[pivot - 1];
    const isValid = predicate(el);
    const isPrevValid = predicate(prevEl);
    if (isValid) {
      if (!isPrevValid) {
        return pivot;
      } else {
        end = pivot;
      }
    } else {
      start = pivot - 1;
    }
  }
  return -1;
}
