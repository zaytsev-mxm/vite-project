/**
 * @param {HTMLElement} root
 * @param {HTMLElement} target
 * @return {HTMLElement | null}
 */
export function nextRightSibling(root: HTMLElement, target: HTMLElement): HTMLElement | null {
    const currentLevelNodes: HTMLElement[] = [root];
    const nextLevelNodes: HTMLElement[] = [];
    let wasTargetFound = root === target;

    while (!wasTargetFound) {
        nextLevelNodes.splice(0);

        currentLevelNodes.forEach((node) => {
            const nodeChildren = [...node.children] as HTMLElement[];
            nextLevelNodes.push(...nodeChildren);
        });

        wasTargetFound = nextLevelNodes.some((node) => node === target);
        if (!wasTargetFound) {
            currentLevelNodes.splice(0);
            nextLevelNodes.forEach((node) => {
                currentLevelNodes.push(node);
            })
        }
    }

    const targetIndex = nextLevelNodes.findIndex((node) => node === target);

    return nextLevelNodes[targetIndex + 1] || null;
}