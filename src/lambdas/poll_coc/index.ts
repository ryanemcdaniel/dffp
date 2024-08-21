import {GetParameterCommand} from '@aws-sdk/client-ssm';
import {coc} from '../client-coc';
import {ssm} from '../client-ssm';

const show = <T>(thing: T): T => {
    console.log(thing);
    return thing;
};

export const handler = async () => {
    const user = await ssm.send(new GetParameterCommand({
        Name          : 'COC_USER',
        WithDecryption: true,
    }));
    const password = await ssm.send(new GetParameterCommand({
        Name          : 'COC_PASSWORD',
        WithDecryption: true,
    }));

    await coc.login({
        email   : user.Parameter!.Value!,
        password: password.Parameter!.Value!,
    });

    const clan = show(await coc.getClan('#2GR2G0PGG'));
    const players = show(await clan.fetchMembers());

    const war = show(await coc.getWars('#2GR2G0PGG'));
    const currentWar = show(await coc.getCurrentWar('#2GR2G0PGG'));

    show(currentWar?.clan.attacks);

    console.log(`${clan.name} (${clan.tag})`);
};
