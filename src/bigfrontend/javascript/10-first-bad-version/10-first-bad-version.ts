// This is a JavaScript coding problem from BFE.dev

type IsBad = (version: number) => boolean;

function firstBadVersion(isBad: IsBad) {
  // firstBadVersion receive a check function isBad
  // and should return a closure which accepts a version number(integer)

  return (version: number): number => {
    // write your code to return the first bad version
    // if none found, return -1
    let left = 0;
    let right = version;

    while (left < right) {
      const pivot = Math.floor((left + right) / 2);
      if (isBad(pivot)) {
        right = pivot;
      } else {
        left = pivot + 1;
      }
    }

    return isBad(left) ? left : -1;
  };
}

export { firstBadVersion };
