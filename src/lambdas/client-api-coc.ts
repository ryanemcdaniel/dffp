import type {Client} from 'clashofclans.js';

let api_coc: Client;

export const init_api_coc = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!api_coc) {
        api_coc = new (await import('clashofclans.js')).Client();
    }
};

export {api_coc};
