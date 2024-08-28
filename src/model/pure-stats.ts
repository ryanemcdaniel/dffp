import {filter, flap, head, last, map, reduce, sort, takeLeft} from 'fp-ts/Array';
import {flow, pipe} from 'fp-ts/function';
import {N} from '#src/model/pure-import.ts';
import {def0, type num} from '#src/model/pure.ts';
import {curry, divide, subtract} from 'lodash';
import {toArray, fromEntries} from 'fp-ts/Record';
import {isNumber} from 'fp-ts/number';
import {toMap} from 'fp-ts/ReadonlyMap';
import console from 'node:console';

export const div = flow(divide);
export const sub = flow(subtract);

export const divN
    = flow(([n1, n2]: num[]) => div(n1, n2));

export const subN
    = flow((n1: num) => curry(sub)(n1));

export const sqrN
    = flow((n: num) => Math.pow(n, 2));

export const sqrtN
    = flow((n: num) => Math.sqrt(n));

export const sumNs
    = flow(reduce([0, 0], ([mag, nt], n: num) => [mag + n, nt++]));

export const aveNs
    = flow(sumNs, divN);

export const sdevNs
    = flow((ns: num[]) => pipe(ns,
        map(subN(aveNs(ns))),
        map(sqrN),
        sumNs,
        divN,
        sqrtN,
    ));

export const rangeNs
    = flow(
        sort(N.Ord),
        (ns) => {
            const [h, l] = [def0(head(ns)), def0(last(ns))];

            return [Math.abs(h - l), h, l];
        },
    );

export const stats = flow(aveNs);
