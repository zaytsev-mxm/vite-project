/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * @param {Array<any>} promises - notice input might have non-Promises
 * @return {Promise<any[]>}
 */
function all(promises: Array<any>): Promise<any[]> {
  function isPromise<T = unknown>(obj?: any): obj is Promise<T> {
    return (
      !!obj && typeof obj.then === 'function' && typeof obj.catch === 'function'
    );
  }

  return new Promise((resolve, reject) => {
    if (!promises.length) {
      resolve([]);
    }
    let resolvedCount = 0;
    const result: any[] = new Array(promises.length);
    const resolveConditionally = () => {
      if (resolvedCount === promises.length) {
        resolve(result);
      }
    };

    function processPromise(maybePromise: any, i: number) {
      if (isPromise(maybePromise)) {
        maybePromise
          .then((data) => {
            result[i] = data;
            resolvedCount++;
            resolveConditionally();
          })
          .catch((err) => {
            reject(err);
          });
      } else {
        result[i] = maybePromise;
        resolvedCount++;
        resolveConditionally();
      }
    }

    promises.forEach((maybePromise, i) => {
      processPromise(maybePromise, i);
    });
  });
}

export { all };
