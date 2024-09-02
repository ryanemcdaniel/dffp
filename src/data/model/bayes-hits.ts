import type {OptimizedWars} from '#src/data/optimize/optimize-types.ts';
import {pipe} from 'fp-ts/function';
import {toArray} from 'fp-ts/Record';
import {filter, map} from 'fp-ts/Array';
import {BayesianClassifier} from 'simple-statistics';

export const bayesHits = (graph: OptimizedWars): BayesianClassifier => {
    const hits = pipe(
        graph.hits,
        toArray,
        filter(([, h]) => h.data.ore1 === 0),
        map(([,h]) => [
            h.data.stars,
            ({
                a_pid   : h.attacker.data.pid,
                a_th_lvl: String(h.attacker.data.th_lvl),
                a_pos   : String(h.attacker.data.pos),
                // d_pid   : h.defender.data.pid,
                d_th_lvl: String(h.defender.data.th_lvl),
                d_pos   : String(h.defender.data.pos),
            }),
        ] as const),
    );

    const model = new BayesianClassifier();

    for (const h of hits) {
        // console.log(h);
        model.train(h[1], `${h[0]}`);
    }

    return model;
};
