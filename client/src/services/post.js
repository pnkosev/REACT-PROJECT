import { get, post, put, remove } from '../helpers/data/requester';
const host = `http://localhost:9999/`;

class PostService {
    constructor() {
        this.baseUrl = `${host}post/`;
        this.getAllUrl = `${this.baseUrl}all?page=`;
        this.getPendingUrl = `${this.baseUrl}pending`;
        this.createPostUrl = `${this.baseUrl}create`;
        this.updateUrl = `${this.baseUrl}update/`;
        this.approvePostUrl = `${this.baseUrl}approve/`
        this.deleteUrl = `${this.baseUrl}delete/`;
        this.likeUrl = `${this.baseUrl}like/`;
        this.hateUrl = `${this.baseUrl}hate/`;
    }

    getAll(page) {
        return get(this.getAllUrl + page);
    }

    getPending() {
        return get(this.getPendingUrl);
    }

    postCreate(p) {
        return post(this.createPostUrl, p);
    }

    getById(id) {
        return get(this.baseUrl + '/details/' + id)
    }

    update(id, post) {
        return put(this.updateUrl + id, post);
    }

    approvePost(id) {
        return put(this.approvePostUrl + id);
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