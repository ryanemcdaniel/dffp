import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm';
import { Client } from 'clashofclans.js';

const ssm = new SSMClient({
    region: 'us-east-1',
});
const client = new Client();

export const handler = async () => {
    const user = await ssm.send(new GetParameterCommand({
        Name          : 'COC_USER',
        WithDecryption: true,
    }));
    const password = await ssm.send(new GetParameterCommand({
        Name          : 'COC_PASSWORD',
        WithDecryption: true,
    }));

    await client.login({ email: user.Parameter.Value, password: password.Parameter.Value });
    const clan = await client.getClan('#2GR2G0PGG');
    console.log(`${clan.name} (${clan.tag})`);
};
