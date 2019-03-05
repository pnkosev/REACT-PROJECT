import { get, post, put, remove } from '../helpers/requester';
const host = `http://localhost:9999/`;

class PostService {
    constructor() {
        this.baseUrl = `${host}post/`;
        this.getAllUrl = `${this.baseUrl}all`;
        this.createUrl = `${this.baseUrl}create`;
        this.updateUrl = `${this.baseUrl}update/`;
        this.deleteUrl = `${this.baseUrl}delete/`;
    }

    getAll() {
        return get(this.getAllUrl);
    }

    postCreate(post) {
        return post(`${host}post/create`, post);
    }

    getById(id) {
        return get(this.baseUrl + id)
    }

    update(id, post) {
        return put(this.updateUrl + id, post);
    }

    remove(id) {
        return remove(this.deleteUrl + id);
    }
}

export default PostService;