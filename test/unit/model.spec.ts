import {describe, it, expect} from 'vitest';
import console from 'node:console';
import {given2} from './model.testdata.ts';

describe('ope', () => {
    it('test', () => {
        const actual = fpCkWarsAnalysis('#2GR2G0PGG', given2);

        expect(actual).toMatchFileSnapshot('./test.json');

        console.log(actual);

        // console.log(toEntries(actual.wars[0]));
    });
});
