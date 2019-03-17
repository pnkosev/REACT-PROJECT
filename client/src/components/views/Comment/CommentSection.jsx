import React, { Component } from 'react';

import Comment from './Comment';
import WithFormCreateComment from '../../forms/CreateComment';
import ServerNotResponding from '../Issue/SeverNotResponding';
import ErrorBoundary from '../../hocs/ErrorBoundary';

import CommentService from '../../../services/comment';

import '../../../styles/comment-section.css';

class CommentSection extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: {},
            hasServerIssue: false,
        }
    }

    //static commentService = new CommentService();

    render() {
        const { hasServerIssue } = this.state;
        const { isAdmin, comments, deleteComment, postId, postComment, updateComms, validateForm } = this.props;

        if (hasServerIssue) {
            return <ServerNotResponding />
        }

        return (
            <div className="container">
                <header className="comment-section">
                    <h2>Leave a comment</h2>
                </header>
                <h4>Comment:</h4>
                <WithFormCreateComment
                    {...this.props}
                    postId={postId}
                    request={postComment}
                    updateComms={updateComms}
                    //request={(creds, id) => CommentSection.commentService.postComment(creds, id)}
                    validateForm={validateForm}
                />
                <div className="comments">
                    <h4>Comments:</h4>
                    <ErrorBoundary>
                        {
                            comments.length
                                ? (comments.map(c =>
                                    <Comment
                                        {...this.props}
                                        author={c.creator.username}
                                        deleteComment={deleteComment}
                                        key={c._id}
                                        id={c._id}
                                        content={c.content}
                                        creatorId={c.creator._id}
                                        isAdmin={isAdmin}
                                    />)
                                ) : <h5>No comments yet...</h5>
                        }
                    </ErrorBoundary>
                </div>
            </div>
        );
    }
}
export default CommentSection;