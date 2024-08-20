import {GetParameterCommand, SSMClient} from '@aws-sdk/client-ssm';
import {Client} from 'clashofclans.js';

const ssm = new SSMClient({
    region: 'us-east-1',
});
const client = new Client();

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

    await client.login({
        email   : user.Parameter!.Value!,
        password: password.Parameter!.Value!,
    });

    const clan = show(await client.getClan('#2GR2G0PGG'));
    const players = show(await clan.fetchMembers());

    const war = show(await client.getWars('#2GR2G0PGG'));
    const currentWar = show(await client.getCurrentWar('#2GR2G0PGG'));

    show(currentWar?.clan.attacks);

    console.log(`${clan.name} (${clan.tag})`);
};

await handler();
