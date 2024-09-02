import console from 'node:console';
import {callPreviousWars} from '#src/api/clash-king.ts';
import {pipe} from 'fp-ts/function';
import {map} from 'fp-ts/Array';
import {ingestCkWar} from '#src/data/ingest/ingest-ck-wars.ts';
import {describe} from 'vitest';
import {deriveWar} from '#src/data/derive/derive.ts';
import {accumulateWarData, linkGraph} from '#src/data/optimize/optimize.ts';
import {bayesHits} from '#src/data/model/bayes-hits.ts';

const DFFP_TAG = '#2GR2G0PGG';
const OPPONENT_TAG = '#RYJQY0RG';

describe('temp', () => {
    it('temp', async () => {
        const dffpWars = await callPreviousWars(DFFP_TAG);
        const opponentWars = await callPreviousWars(OPPONENT_TAG);

        const derivedWars = pipe(
            dffpWars.contents.concat(opponentWars.contents),
            map(ingestCkWar),
            map(deriveWar),
        );

        const wars = pipe(
            derivedWars,
            accumulateWarData,
            linkGraph,
        );

        const bayesModel = bayesHits(wars);

        console.log(bayesModel.totalCount);

        const score = bayesModel.score({
            a_pid   : '#LQR0YQVJ',
            a_th_lvl: '16',
            a_pos   : '1',
            // d_pid   : '#9YL0YUPP2',
            d_th_lvl: '16',
            d_pos   : '1',
        });

        console.log(score);
    });
});
