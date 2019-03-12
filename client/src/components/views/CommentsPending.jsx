import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import CommentService from '../../services/comment';
import notify from '../../helpers/notifier';
import ServerNotResponding from '../views/SeverNotResponding';
import withError from '../hocs/WithError';
import Comment from '../common/Comment';
import ErrorBoundary from '../common/ErrorBoundary';

class CommentsPending extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAdmin: false,
            comments: [],
            hasChanged: false,
            hasServerIssue: false,
        }

        this.deleteComment = this.deleteComment.bind(this);
        this.approveComment = this.approveComment.bind(this);
    }

    static commentService = new CommentService();

    async approveComment(id) {
        try {
            let data = await CommentsPending.commentService.approveComment(id);

            if (!data.success) {
                notify('error', data.message);
            } else {
                this.setState({ hasChanged: true, });
                notify('success', data.message);
                //this.getPendingComments();
            }
        }   catch(err) {
            this.setState({ hasServerIssue: true });
            console.log(err);
        }
    }

    async deleteComment(id) {
        try {
            let data = await CommentsPending.commentService.deleteComment(id);

            if (!data.success) {
                notify('error', data.message);
            } else {
                this.setState({ hasChanged: true, });
                //this.getPendingComments();
                notify('success', data.message);
            }
        } catch(err) {
            this.setState({ hasServerIssue: true });
            console.log(err);
        }
    }

    async getPendingComments() {
        
        try {
            let data = await CommentsPending.commentService.getPendingComments();

            if (!data.success) {
                notify('error', data.message);
            } else {
                this.setState({
                    comments: data.comments,
                    hasChanged: false,
                });
            }
        } catch(err) {
            this.setState({ hasServerIssue: true });
            console.log(err);
        }
    }

    componentDidMount() {
        const isAdmin = (localStorage.getItem('isAdmin') === 'true');
        this.setState({ isAdmin });
        this.getPendingComments();
    }

    componentDidUpdate(pP, pS) {
        if (pS.hasChanged !== this.state.hasChanged) {
            console.log('yo, no infinite loops!');
            this.getPendingComments();
        }
    }

    render() {
        const { comments, hasServerIssue, isAdmin } = this.state;

        if (hasServerIssue) {
            return <ServerNotResponding/>
        }

        return (
            <div>
                <ErrorBoundary>
                <h3>Pending Comments:</h3>
                <ul>
                    {
                        comments.length
                        ? (
                            comments.map(c => 
                                <Comment key={c._id}
                                    username={c.creator.username}
                                    isAdmin={isAdmin}
                                    content={c.content}
                                    id={c._id}
                                    creator={c.creator._id}
                                    status={c.status}
                                    deleteComment={() => this.deleteComment(c._id)}
                                    approveComment={() => this.approveComment(c._id)}
                                />)
                        ) : (
                            <li>No comments to approve for now.</li>
                        )
                    }
                </ul>
                </ErrorBoundary>
            </div>
        )
    }
}

export default withError(CommentsPending);