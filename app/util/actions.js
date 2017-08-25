import fetch from 'isomorphic-fetch';

export function postFormData(route, token, body, files) {
    const formData = new FormData();

    for (var fileKey in files) {
        if (
            files.hasOwnProperty(fileKey) &&
            typeof files[fileKey] === 'object'
        ) {
            formData.append(fileKey, files[fileKey]);
        }
    }

    for (var key in body) {
        if (body.hasOwnProperty(key)) {
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

export function getResponseFromRoute(route, token = '') {
    const headers = {
        'Content-Type': 'application/json'
    };

    if (token.length > 0) {
        headers.Authorization = 'Bearer ' + token;
    }

    return fetch(route, {
        method: 'get',
        headers: new Headers(headers)
    });
}
