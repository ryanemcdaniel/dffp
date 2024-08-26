import * as console from 'node:console';

export const tryJson = <T>(body: T): T => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return JSON.parse(body);
    }
    catch (e) {
        console.error(e);
        return {};
    }
};
