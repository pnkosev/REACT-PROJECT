import React, { Component } from 'react';
import CommentService from '../../services/comment';
import notify from '../../helpers/notifier';

class CommentsPending extends Component {
    constructor(props) {
        super(props);

        this.state = {
            comments: []
        }
    }

    static commentService = new CommentService();

    async approveComment(id) {
        try {
            let data = await CommentsPending.commentService.approveComment(id);

            if (!data.success) {
                notify('error', data.message);
                return;
            } else {
                notify('success', data.message)
            }
        }   catch(err) {
            console.log(err);
        }
        this.getPendingComments();
    }

    async getPendingComments() {
        try {
            let data = await CommentsPending.commentService.getPendingComments();

            if (!data.success) {
                notify('error', data.message);
                return;
            } else {
                this.setState({
                    comments: data.comments,
                });
            }
        } catch(err) {
            console.log(err);
        }
    }

    componentDidMount() {
        this.getPendingComments();
    }

    render() {
        const { comments } = this.state;
        return (
            <div>
                <h3>Pending Comments:</h3>
                <ul>
                    {
                        comments.length
                        ? (
                            comments.map(c => <div key={c._id}><li key={c._id}>{c.content}</li><button onClick={() => this.approveComment(c._id)}>Approve</button></div>)
                        ) : (
                            <li>No comments to approve for now.</li>
                        )
                    }
                </ul>
            </div>
        )
    }
}

export default CommentsPending;