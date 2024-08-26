import console from 'node:console';

export const show = <T>(obj: T): T => {
    // console.log(inspect(obj, false, null, true));

    const thing = JSON.stringify(obj, null, 4);
    const bytes = JSON.stringify(obj, null);

    console.log('show', thing);
    console.log('kb', bytes.length / 1024);
    return obj;
};

export const noClient = <T extends {client: any}>(obj: T): T => {
    const {client, ...rest} = obj;
    return rest;
};
