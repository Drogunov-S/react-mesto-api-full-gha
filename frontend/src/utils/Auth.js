import {propertiesApiAuth} from "./properties";

class Auth {
    constructor({baseUrl, headers}) {
        this._baseUrl = baseUrl;
        this._headers = headers
    }

    register = (username, password) => {
        return this._request(`${this._baseUrl}/signup`, {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify({email: username, password})
        })
    }

    authorize(email, password) {
        return this._request(`${this._baseUrl}/signin`, {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify({email, password})
        })
    }

    checkToken() {
        return this._request(`${this._baseUrl}/users/me`, {
            method: 'GET',
            headers: this._headers,
        })
            .then((data) => {
                return data.data;
            })
    }


    _request(url, options) {
        options.headers.authorization = localStorage.getItem('jwt');
        return fetch(url, options)
            .then(response => {
                return response.ok
                    ? response.json()
                    : Promise.reject(response.json());
            })
    }
}

const auth = new Auth(propertiesApiAuth);

export default auth;
