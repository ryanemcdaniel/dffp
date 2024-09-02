import console from 'node:console';
import {callPreviousWars} from '#src/api/clash-king.ts';
import {pipe} from 'fp-ts/function';
import {map} from 'fp-ts/Array';
import {dispatchCkWar} from '#src/data/dispatch/dispatch.ts';
import {describe} from 'vitest';

const DFFP_TAG = '#2GR2G0PGG';
const OPPONENT_TAG = '#RYJQY0RG';

describe('temp', () => {
    it('temp', async () => {
        const dffpWars = await callPreviousWars(DFFP_TAG);
        const opponentWars = await callPreviousWars(OPPONENT_TAG);

        const dispatchedWars = pipe(dffpWars.contents.concat(opponentWars.contents), map(dispatchCkWar));

        console.log(dispatchedWars.length);
    });
});
