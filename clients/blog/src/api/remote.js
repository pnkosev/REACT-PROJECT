const host = 'http://localhost:9999/';

async function register(username, email, password) {
    const res = await fetch(host + 'user/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            email,
            password
        })
    });
    return await res.json();
}

async function login(username, password) {
    const res = await fetch(host + 'user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password
        })
    });
    return await res.json();
}

export {
    register,
    login
};