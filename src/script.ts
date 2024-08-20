import dotenv from 'dotenv';
import { Client } from 'clashofclans.js';

const config = dotenv.config({ path: `.env.local` });

console.log(config.parsed.password);

const client = new Client();

(async function () {
    // This method should be called once when application starts.
    await client.login({ email: 'ryanephraimmcdaniel@hotmail.com', password: config.parsed.password });

    const clan = await client.getClan('#2GR2G0PGG');
    console.log(`${clan.name} (${clan.tag})`);
})();
