import { get, post, put, remove } from '../helpers/requester';
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

    approveComment(id) {
        return put(this.baseUrl + 'approve/' + id);
    }

    deleteComment(id) {
        return remove(this.baseUrl + 'delete/' + id);
    }
}

export default CommentService;