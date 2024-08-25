import {api_coc} from '#src/lambdas/client-api-coc.ts';
import {getSecret} from '#src/lambdas/client-aws.ts';
import * as console from 'node:console';
import {inspect} from 'node:util';
import {doAll} from '#src/lambdas/util.ts';

const show = <T>(obj: T): T => {
    // console.log(inspect(obj, false, null, true));

    const thing = JSON.stringify(obj, null, 4);
    const bytes = JSON.stringify(obj, null);

    console.log('show', thing);
    console.log('kb', bytes.length / 1024);
    return obj;
};

const noClient = <T extends {client: any}>(obj: T): T => {
    const {client, ...rest} = obj;
    return rest;
};

/**
 * @init
 */
const email = await getSecret('COC_USER');
const password = await getSecret('COC_PASSWORD');

await api_coc.login({
    email,
    password,
    keyCount: 1,
    keyName : `${process.env.LAMBDA_ENV}-poll-coc`,
});

const dffp = '#2GR2G0PGG';

/**
 * @invoke
 */
export const handler = async () => {
    const clan = await api_coc.getClan(dffp);

    const wars = await api_coc.getWars(dffp);

    show(wars.map(noClient).map((w) => w.opponent.averageAttackDuration));
};

await handler();
