import { get, post, put, remove } from '../helpers/data/requester';
const host = `http://localhost:9999/`;

class CommentService {
    constructor() {
        this.baseUrl = `${host}comment/`;
    }

    postComment(id, content) {
        return post(this.baseUrl + id + '/create', content);
    }

    getPendingComments() {
        return get(this.baseUrl + 'pending')
    }

    getCommentById(id) {
        return get(this.baseUrl + 'get/' + id);
    }

    approveComment(id) {
        return put(this.baseUrl + 'approve/' + id);
    }

    updateComment(id, content) {
        return put(this.baseUrl + 'update/' + id, content);
    }

    deleteComment(id) {
        return remove(this.baseUrl + 'delete/' + id);
    }
}

export default CommentService;