function numOfSubarrays(arr: number[]): number {
    const longestSubArraysList = arr.map((_, i) => {
        return arr.slice(0, i + 1)
    })

    function processArray(arr: number[][]){
        return arr.reduce((acc, el, i) => {
            if (i) {
                return acc.concat([el.slice(1)])
            } else {
                return acc
            }
        }, [] as number[][])
    }

    function summator(acc: number[] = [], el: number[]) {
        const sums = el.reduce((sum, n) => sum + n, 0)
        if (sums % 2 === 0) {
            return acc
        } else {
            return acc.concat(sums)
        }
    }

    let newArr: number[][] = longestSubArraysList
    let stack: number[] = newArr.reduce(summator, [])

    do {
        newArr = processArray(newArr)
        stack = stack.concat(newArr.reduce(summator, []))
    } while (newArr.length > 0)

    return stack.length
}

const res = numOfSubarrays([1, 2, 3, 4, 5, 6, 7])
console.log(`res = ${res}`)

export { numOfSubarrays }