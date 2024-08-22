import {api_coc} from '#src/lambdas/client-api-coc.ts';
import {getSecret} from '#src/lambdas/client-aws.ts';

/**
 * @init
 */
const user = await getSecret('COC_USER');
const password = await getSecret('COC_PASSWORD');

/**
 * @invoke
 */
export const handler = async () => {
    await api_coc.login({email: user, password});

    const clan = await api_coc.getClan('#2GR2G0PGG');

    console.log(`login success`);
    console.log(`${clan.name} (${clan.tag})`);
};
