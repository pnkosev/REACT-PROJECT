import { get, post } from '../helpers/requester';
const host = `http://localhost:9999/`;


function postRegister(credentials) {
    return post(`${host}user/register`, credentials);
}

function postLogin(credentials) {
    return post(`${host}user/login`, credentials);
}

function getProfile() {
    return get(`${host}user/profile`);
}

export {
    postRegister,
    postLogin,
    getProfile
};

// class AuthService {
//     constructor() {
//         this.baseUrl = `${host}user/`;
//         this.registerUrl = `${this.baseUrl}register`;
//         this.loginUrl = `${this.baseUrl}login`;
//     }

//     postRegister(credentials) {
//         return post(this.registerUrl, credentials);
//     }

//     postLogin(credentials) {
//         return post(`${host}user/login`, credentials);
//     }
// }