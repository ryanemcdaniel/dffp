import {map as mapN, mapWithIndex, reduce, sort, takeLeft, takeRight, unzip} from 'fp-ts/ReadonlyArray';
import {flow, pipe} from 'fp-ts/function';
import {N} from '#src/pure/pure-import.ts';
import {type num} from '#src/pure/pure.ts';
import {curry, divide, subtract} from 'lodash';
import {map as mapR} from 'fp-ts/ReadonlyRecord';
import {toReadonlyArray} from 'fp-ts/es6/ReadonlyRecord';

type rnum = readonly num[];

export const div = flow(divide);
export const sub = flow(subtract);
export const mag = flow(sub, Math.abs);

export const divN = flow(
    ([n1, n2]: rnum) => div(n1, n2),
);

export const subN = flow(
    (n1: num) => curry(sub)(n1),
);

export const sqrN = flow(
    (n: num) => Math.pow(n, 2),
);

export const sqrtN = flow(
    (n: num) => Math.sqrt(n),
);

export const sumNs = flow(
    reduce([0, 0], ([mag, nt], n: num) => [mag + n, nt + 1]),
);

export const meanNs = flow(
    sumNs,
    divN,
);

export const sdevNs = flow(
    (ns: rnum) => pipe(
        ns,
        mapN(subN(meanNs(ns))),
        mapN(sqrN),
        sumNs,
        divN,
        sqrtN,
    ),
);

export const medianNs = flow(
    sort(N.Ord),
    (ns) => ns[Math.ceil(ns.length / 2)],
);

export const modeNs = flow(
    sort(N.Ord),
    (ns: rnum): rnum => pipe(
        ns,
        reduce({} as num[], (nst, n) => {
            nst[n] ??= 0;
            nst[n]++;
            return nst;
        }),
        reduce([0, 0], ([nk0, nv0], [nk, nv]) => nv > nv0
            ? [nk, nv]
            : [nk0, nv0]),
    ),
);

export const domainNs = flow(
    (ns: rnum) => mag(0, ns.length),
);

export const rangeNs = flow(
    sort(N.Ord),
    (ns) => mag(takeRight(1)(ns)[0], takeLeft(1)(ns)[0]),
);

export const histogram = flow(
    sort(N.Ord),
    (ns: rnum) => pipe(
        ns,
        reduce({} as {[k in num]: num}, (nst, n) => {
            nst[n] ??= 0;
            nst[n]++;
            return nst;
        }),
        toReadonlyArray,
        unzip,
    ),
);

export const d1_samples = flow(
    (ns: rnum) => pipe(
        ns,
        mapWithIndex((ndx, n) => [ndx, n]),
    ),
);

export const d1_stats = flow(
    (ns: num[]) => pipe(
        {
            mean   : meanNs,
            median : medianNs,
            mode   : modeNs,
            sdev   : sdevNs,
            domain : domainNs,
            range  : rangeNs,
            hist   : histogram,
            samples: d1_samples,
        } as const,
        mapR((stat) => stat(ns)),
    ),
);
