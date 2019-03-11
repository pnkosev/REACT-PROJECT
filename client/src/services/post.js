import { get, post, put, remove } from '../helpers/requester';
const host = `http://localhost:9999/`;

class PostService {
    constructor() {
        this.baseUrl = `${host}post/`;
        this.getAllUrl = `${this.baseUrl}all`;
        this.createUrl = `${this.baseUrl}create`;
        this.updateUrl = `${this.baseUrl}update/`;
        this.deleteUrl = `${this.baseUrl}delete/`;
        this.likeUrl = `${this.baseUrl}like/`;
        this.hateUrl = `${this.baseUrl}hate/`;
    }

    getAll() {
        return get(this.getAllUrl);
    }

    postCreate(p) {
        return post(`${host}post/create`, p);
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

    postLike(id) {
        return post(this.likeUrl + id);
    }

    postHate(id) {
        return post(this.hateUrl + id);
    }
}

export default PostService;