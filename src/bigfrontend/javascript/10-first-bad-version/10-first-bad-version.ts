// This is a JavaScript coding problem from BFE.dev

type IsBad = (version: number) => boolean;

function firstBadVersion(isBad: IsBad) {
  // firstBadVersion receive a check function isBad
  // and should return a closure which accepts a version number(integer)
  return (_version: number): number => {
    // write your code to return the first bad version
    // if none found, return -1
    let left = 0;
    let right = Number.MAX_SAFE_INTEGER;
    let pivot = NaN;
    while (left <= right) {
      pivot = Math.ceil((right + left) / 2);
      if (isBad(pivot) && !isBad(pivot - 1)) {
        return pivot;
      }

      if (isBad(pivot)) {
        right = pivot - 1;
      } else {
        left = pivot + 1;
      }
    }
    return -1;
  };
}

export { firstBadVersion };
