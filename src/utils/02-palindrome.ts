function isPalindrome(s: string): boolean {
    let i = 0;
    let j = s.length - 1;
    const alphaNumRegex = /[a-z0-9]/i;
    let hasAnyLetter = false;

    while (i <= j) {
        while (i <= j && !alphaNumRegex.test(s[i]!)) i++;
        while (i <= j && !alphaNumRegex.test(s[j]!)) j--;
        if (i > j) break;

        hasAnyLetter = true;

        if (s[i]!.toLowerCase() !== s[j]!.toLowerCase()) {
            return false;
        }

        i++;
        j--;
    }

    // If there were no letters/digits at all, the cleaned string is empty => palindrome
    if (!hasAnyLetter) {
        return true;
    }

    return true;
}

export { isPalindrome }
