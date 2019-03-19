import React from 'react';

import Comment from './Comment';
import WithFormCreateComment from '../forms/CreateComment';
import ServerNotResponding from '../views/Issue/SeverNotResponding';
import ErrorBoundary from '../hocs/ErrorBoundary';
import withError from '../hocs/WithError';

import '../../styles/comment-section.css';

const CommentSection = (props) => {
    const { isAdmin, comments, deleteComment, postId, postComment, updateComms, validateForm, serverIssue } = props;

    if (serverIssue) {
        return <ServerNotResponding />;
    }

    return (
        <div className="container">
            <header className="comment-section">
                <h2>Leave a comment</h2>
            </header>
            <h4>Comment:</h4>
            <WithFormCreateComment
                {...props}
                postId={postId}
                request={postComment}
                updateComms={updateComms}
                validateForm={validateForm}
            />
            <div className="comments">
                <h4>Comments:</h4>
                <ErrorBoundary>
                    <ul className="comments">
                        {
                            comments.length
                                ? (comments.map(c =>
                                    <Comment
                                        {...props}
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
                    </ul>
                </ErrorBoundary>
            </div>
        </div>
    );
}

export default withError(CommentSection);