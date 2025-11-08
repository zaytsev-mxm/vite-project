import { describe, it, expect } from 'vitest';
import { type Entities, renderTextWithEntities, renderTextWithEntities2 } from './178-twitter-mention-hashtag.ts';

const TEXT = 'Shaku syntax is now supported on https://t.co/UpkmJ7yGKG! Give it a try to annotate your code ! kudos to @JSer_ZANP for making such a great tool !';
const ENTITIES: Entities = {
    "urls": [
        {
            "displayUrl": "BFE.dev", // url to display
            "url": "https://t.co/UpkmJ7yGKG", // actual url to redirect
            "indices": [
                33, // start index, inclusive
                56 // end index, exclusive
            ]
        }
    ],
    "mentions": [
        {
            "screeName": "JSer_ZANP", // display screen name
            "indices": [
                105, // start index, inclusive
                115 // end index, exclusive
            ]
        }
    ]
};

describe('renderTextWithEntities', () => {
    it('should render a correct string', () => {
        const expected = 'Shaku syntax is now supported on <a href="https://t.co/UpkmJ7yGKG">BFE.dev</a>! Give it a try to annotate your code ! kudos to <a href="https://x.com/JSer_ZANP">@JSer_ZANP</a> for making such a great tool !';

        expect(renderTextWithEntities(TEXT, ENTITIES)).toEqual(expected);
        expect(renderTextWithEntities2(TEXT, ENTITIES)).toEqual(expected);
    });
});