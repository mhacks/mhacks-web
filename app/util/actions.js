import fetch from 'isomorphic-fetch';
import { endpoints } from '../constants';

export function postFormData(route, token, body, files) {
    const formData = new FormData();

    for (var fileKey in files) {
        if (
            Object.prototype.hasOwnProperty.call(files, fileKey) &&
            typeof files[fileKey] === 'object'
        ) {
            formData.append(fileKey, files[fileKey]);
        }
    }

    for (var key in body) {
        if (Object.prototype.hasOwnProperty.call(body, key)) {
            formData.append(key, body[key]);
        }
    }

    return fetch(route, {
        method: 'post',
        headers: new Headers({
            Authorization: 'Bearer ' + token
        }),
        body: formData
    });
}

export function postRequest(route, token = '', body) {
    const headers = {
        'Content-Type': 'application/json'
    };

    if (token.length > 0) {
        headers.Authorization = 'Bearer ' + token;
    }

    return fetch(route, {
        method: 'post',
        headers: new Headers(headers),
        body: JSON.stringify(body)
    });
}

export function deleteRequest(route, token = '', body) {
    const headers = {
        'Content-Type': 'application/json'
    };

    if (token.length > 0) {
        headers.Authorization = 'Bearer ' + token;
    }

    return fetch(route, {
        method: 'delete',
        headers: new Headers(headers),
        body: JSON.stringify(body)
    });
}

export function getResponseFromRoute(route, authRequired) {
    const headers = {
        'Content-Type': 'application/json'
    };

    if (authRequired == undefined || authRequired) {
        const token = localStorage.getItem('jwt');

        if (token.length > 0) {
            headers.Authorization = 'Bearer ' + token;
        }
    }

    return fetch(route, {
        method: 'get',
        headers: new Headers(headers)
    });
}

export function postResponseFromRoute(route, data) {
    const token = localStorage.getItem('jwt');

    return postRequest(route, token, data);
}

export function postFormResponseFromRoute(route, data, files) {
    const token = localStorage.getItem('jwt');

    return postFormData(route, token, data, files);
}

export function deleteResponseFromRoute(route, data) {
    const token = localStorage.getItem('jwt');

    return deleteRequest(route, token, data);
}

export function loadFormRequest(token, formRoute) {
    return getResponseFromRoute(endpoints.FORM + formRoute, token);
}
