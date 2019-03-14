function request(method) {
    const getAuthHeader = () => {
        const token = localStorage.getItem('authToken');
        return (token && token.length)
            ? { 'Authorization': `Bearer ${token}` }
            : {};
    }

    return async (url, data = {}, options = {}) => {
        const authHeader = getAuthHeader();

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...authHeader,
            },
            body: Object.keys(data).length ? JSON.stringify(data) : null,
            ...options
        })
        return await response.json();
    }
};

export const get = request('get');
export const post = request('post');
export const put = request('put');
export const remove = request('delete');