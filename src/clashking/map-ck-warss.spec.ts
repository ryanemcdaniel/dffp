import {describe, it, expect} from 'vitest';
import console from 'node:console';
import {show} from '../../util.ts';
import {fpCkWar} from '#src/clashking/mappers/fp-ck-war.ts';
import {fpCkWars} from '#src/clashking/mappers/fp-ck-wars.ts';
import {fpCkWarsAnalysis} from '#src/clashking/mappers/fp-ck-wars-analysis.ts';
import {given2} from '#src/clashking/give.ts';

describe('ope', () => {
    it('test', () => {
        const actual = fpCkWarsAnalysis('#2GR2G0PGG', given2);

        console.log(actual);

        expect(actual).toMatchFileSnapshot('./test.json');
    });
});
