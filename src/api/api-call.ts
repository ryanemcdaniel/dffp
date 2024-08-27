/* eslint-disable @typescript-eslint/no-empty-object-type,@typescript-eslint/no-unnecessary-type-parameters */

import {URL} from 'node:url';
import console from 'node:console';
import {show} from '../../util.ts';

export const bindApiCall = (baseUrl: string) => async <
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
    show?    : boolean;
}) => {
    const {
        show: shouldShow = true,
    } = ops;

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

    if (ops.bearer) {
        req.headers.set('Authorization', `Bearer ${ops.bearer}`);
    }

    if (ops.jsonBody) {
        req.headers.set('Content-Type', 'application/json');
    }

    console.log(`[${url.hostname}][${ops.method} ${ops.path}]:`, {
        headers: req.headers,
        body   : shouldShow && ops.jsonBody,
    });

    const resp = await fetch(req);

    console.log(`[${url.hostname}][${ops.method} ${ops.path}]: ${resp.status} ${resp.statusText}`, {
        headers: resp.headers,
    });

    let json: RJSON;

    try {
        json = shouldShow
            ? show(await resp.json()) as RJSON
            : await resp.json();
    }
    catch (e) {
        json = {} as RJSON;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    resp.contents = json;

    return resp as Response & {contents: RJSON};
};
