function topKFrequent(nums: number[], k: number): number[] {
    const hash: Record<string, number> = {};
    for (let i = 0; i < nums.length; i++) {
        const num = nums[i];
        const current = hash[num] || 0;
        hash[num] = current + 1;
    }
    const sorted = Object.entries(hash).sort(([,a], [,b]) => (b - a));
    const res = sorted.slice(0, k);
    return res.map(([n]) => Number(n));
}

export { topKFrequent }
