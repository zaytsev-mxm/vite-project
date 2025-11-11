function groupTotals(strArr: string[]) {
  // An object to store the sums for each unique letter:
  const sums: Record<string, number> = {};

  // Loop over the input array, and calculate the sums:
  strArr.forEach((str) => {
    const parsed = str.split(':');
    const char = parsed[0];
    const val = Number(parsed[1]);
    const currentVal = sums[char] || 0;
    const newVal = currentVal + val;
    sums[char] = newVal;
  });

  // Prepare an array to store the result:
  const resArr: string[] = [];

  // Loop over the sums, and put the values to the resulting array:
  for (const char in sums) {
    const val = sums[char];
    if (val !== 0) {
      resArr.push(`${char}:${val}`);
    }
  }

  // Convert the resulting array to a string:
  const resStr = resArr.join(',');

  return resStr;
}

console.log(groupTotals(['X:-1', 'Y:1', 'X:-4', 'B:3', 'X:5']));
