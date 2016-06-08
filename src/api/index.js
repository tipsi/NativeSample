//import fetch from 'fetch';
import { base } from '../const';

const methods = {
    fetch: fetch,
    patch: (url, body) => fetch(url, Object.assign({}, {body}, {method: 'POST'})),
    patch: (url, body) => fetch(url, Object.assign({}, {body}, {method: 'PATCH'})),
    delete: (url, body) => fetch(url, Object.assign({}, {body}, {method: 'DELETE'})),
};

const urls = {
    search: `${base}/v001/wine/search/?keyword=`,
}

export const searchWine = str => fetch(`${urls.search}${str}`);
export const ss = str => `${urls.search}${str}`;
