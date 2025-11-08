// https://bigfrontend.dev/problem/twitter-mention-hashtag

type EntityBase = {
    indices: [number, number]
}

type UrlEntity = EntityBase & {
    displayUrl: string,
    url: string,
}

type MentionEntity = EntityBase & {
    screeName: string
}

export type Entities = {
    urls: Array<UrlEntity>,
    mentions: Array<MentionEntity>
}

function renderTextWithEntities(text: string, entities: Entities): string {
    const allEntities: Array<UrlEntity | MentionEntity> = [];
    allEntities.push(...entities.urls);
    allEntities.push(...entities.mentions);
    allEntities.sort(({indices: [a]}, {indices: [b]}) => {
        return a - b;
    });

    let start: number = 0;
    let end: number | undefined = allEntities[0].indices[0];
    let res: string = '';
    for (let i = 0; i <= allEntities.length; i++) {
        const entity = allEntities[i];
        const subStr = text.substring(start, end);
        start = entity?.indices?.[1];
        end = allEntities?.[i + 1]?.indices?.[0];
        res += subStr;
        let replacement = '';
        if (entity) {
            if ('displayUrl' in entity && 'url' in entity) {
                const {url, displayUrl} = entity as UrlEntity;
                replacement = `<a href="${url}">${displayUrl}</a>`;
            }
            if ('screeName' in entity) {
                const {screeName} = entity as MentionEntity;
                replacement = `<a href="https://x.com/${screeName}">@${screeName}</a>`;
            }
        }
        if (replacement) {
            res += replacement;
        }
    }

    return res;
}

function renderTextWithEntities2(text: string, entities: Entities): string {
    // Create an Array of <none> to later fill it in with references to the entities.
    // The length of the array equals to the length of the original string:
    // this is needed to make sure that the references to the entities are ordered correctly
    // (because we use the indices as the keys)
    const sortedEntities: Array<UrlEntity | MentionEntity> = new Array(text.length);

    const add = (entity: UrlEntity | MentionEntity) => {
        sortedEntities[entity.indices[0]] = entity;
    }

    entities.urls.forEach(add);
    entities.mentions.forEach(add);

    let res = '';

    // Here we will be storing the index of the end of a range
    // that we are going to replace with an "<a>...</a>":
    let skipUntilIdx: number | undefined = undefined;

    for (let i = 0; i < sortedEntities.length; i++) {
        if (skipUntilIdx !== undefined && i < skipUntilIdx) {
            continue;
        } else {
            skipUntilIdx = undefined;
        }
        const entity = sortedEntities[i];
        if (entity === undefined) {
            res += text[i];
        } else {
            let replacement = '';
            if ('displayUrl' in entity && 'url' in entity) {
                const {url, displayUrl} = entity as UrlEntity;
                replacement = `<a href="${url}">${displayUrl}</a>`;
            }
            if ('screeName' in entity) {
                const {screeName} = entity as MentionEntity;
                replacement = `<a href="https://x.com/${screeName}">@${screeName}</a>`;
            }
            res += replacement;
            skipUntilIdx = entity.indices[1];
        }
    }

    return res;
}


// ------------------------------------

export {renderTextWithEntities, renderTextWithEntities2}


