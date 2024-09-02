/* eslint-disable @typescript-eslint/no-empty-object-type,@typescript-eslint/no-unnecessary-type-parameters */

import {URL, URLSearchParams} from 'node:url';
import console from 'node:console';
import {show} from '../../util.ts';

export const apiCall = async <
    RJSON = {},
    Q extends{[key: string]: string} = {},
    B = {},
>(ops: {
    base     : string;
    method   : string;
    path     : string;
    headers? : {[key: string]: string};
    bearer?  : string;
    query?   : Q;
    body?    : RequestInit['body'];
    jsonBody?: B;
    form?    : {[key: string]: string};
}) => {
    const search = ops.query
        ? `?${new URLSearchParams(ops.query).toString()}`
        : '';

    const req = new Request(
        new URL(`${ops.base}${ops.path}${search}`),
        {
            method: ops.method,
            body  : ops.jsonBody
                ? JSON.stringify(ops.jsonBody)
                : ops.body
                ?? null,
        },
    );

    if (ops.headers) {
        for (const key in ops.headers) {
            req.headers.append(key, ops.headers[key]);
        }
    }

    if (ops.bearer) {
        req.headers.set('Authorization', `Bearer ${ops.bearer}`);
    }

    const resp = await fetch(req);

    console.log(resp.status);
    console.log(resp.statusText);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    resp.contents = async () => show(await resp.json());

    return resp as Response & {contents: () => Promise<RJSON>};
};

export const bindApiCall = (baseUrl: string) =>
    async <
        RJSON = {},
        Q extends{[key: string]: string | number | boolean} = {},
        B = {},
    >(ops: {
        method   : string;
        path     : string;
        headers? : {[key: string]: string};
        bearer?  : string;
        query?   : Q;
        body?    : RequestInit['body'];
        jsonBody?: B;
        form?    : {[key: string]: string};
    }) => {
        const url = new URL(`${baseUrl}${ops.path}`);

        if (ops.query) {
            for (const key in ops.query) {
                url.searchParams.append(key, ops.query[key]);
            }
        }

        const req = new Request(url, {
            method: ops.method,
            body  : ops.jsonBody
                ? JSON.stringify(ops.jsonBody)
                : ops.body
                ?? null,
        });

        if (ops.headers) {
            for (const key in ops.headers) {
                req.headers.append(key, ops.headers[key]);
            }
        }

        ops.bearer && req.headers.set('Authorization', `Bearer ${ops.bearer}`);

        if (ops.jsonBody) {
            req.headers.set('Content-Type', 'application/json');
        }

        console.log(`[${url.hostname}][${ops.method} ${ops.path}]:`, {
            headers: req.headers,
            body   : ops.jsonBody,
        });

        const resp = await fetch(req);

        console.log(`[${url.hostname}][${ops.method} ${ops.path}]: ${resp.status} ${resp.statusText}`, {
            headers: resp.headers,
        });

        let json: RJSON;

        try {
            json = await resp.json() as RJSON;
        }
        catch (e) {
            json = {} as RJSON;
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        resp.contents = json;

        return resp as Response & {contents: RJSON};
    };
