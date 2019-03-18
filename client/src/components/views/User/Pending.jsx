import React, { Component, Fragment } from 'react';

import notify from '../../../helpers/data/notifier';
import { UserConsumer } from '../../contexts/UserContext';
import CommentService from '../../../services/comment';
import PostService from '../../../services/post';

import withError from '../../hocs/WithError';
import ErrorBoundary from '../../hocs/ErrorBoundary';

import ServerNotResponding from '../Issue/SeverNotResponding';
import Comment from '../Comment/Comment';
import Post from '../Post/Post';

class Pending extends Component {
    constructor(props) {
        super(props);

        this.state = {
            comments: [],
            posts: [],
            hasFetched: false,
            haveCommentsChanged: false,
            havePostsChanged: false,
            hasServerIssue: false,
        }

        this.deleteComment = this.deleteComment.bind(this);
        this.approveComment = this.approveComment.bind(this);

        this.deletePost = this.deletePost.bind(this);
        this.approvePost = this.approvePost.bind(this);
    }

    static commentService = new CommentService();
    static postService = new PostService();

    async approveComment(id) {
        // let comments = this.state.comments.slice();
        // let index = comments.findIndex(c => c._id === id);
        // comments.splice(index, 1);

        try {
            let data = await Pending.commentService.approveComment(id);

            if (!data.success) {
                notify('error', data.message);
            } else {
                this.setState({ haveCommentsChanged: !this.state.haveCommentsChanged, });
                notify('success', data.message);
            }
        }   catch(err) {
            this.setState({ hasServerIssue: true });
            console.log(err);
        }
    }

    async deleteComment(id) {
        // let comments = this.state.comments.slice();
        // let index = comments.findIndex(c => c._id === id);
        // comments.splice(index, 1);

        try {
            let data = await Pending.commentService.deleteComment(id);

            if (!data.success) {
                notify('error', data.message);
            } else {
                this.setState({ haveCommentsChanged: !this.state.haveCommentsChanged, });
                notify('success', data.message);
            }
        } catch(err) {
            this.setState({ hasServerIssue: true });
            console.log(err);
        }
    }

    async getPendingComments() {
        try {
            let data = await Pending.commentService.getPendingComments();

            if (!data.success) {
                notify('error', data.message);
            } else {
                this.setState({
                    comments: data.comments,
                    hasFetched: true,
                });
            }
        } catch(err) {
            this.setState({ hasServerIssue: true });
            console.log(err);
        }
    }

    async getPendingPosts() {
        try {
            let data = await Pending.postService.getPending();

            if (!data.success) {
                notify('error', data.message);
            } else {
                this.setState({
                    posts: data.posts,
                    hasFetched: true,
                });
            }
        } catch(err) {
            this.setState({ hasServerIssue: true });
            console.log(err);
        }
    }

    async approvePost(e, id) {
        e.preventDefault();

        try {
            let data = await Pending.postService.approvePost(id);

            if (!data.success) {
                notify('error', data.message);
            } else {
                this.setState({ havePostsChanged: !this.state.havePostsChanged, });
                notify('success', data.message);
            }
        }   catch(err) {
            this.setState({ hasServerIssue: true });
            console.log(err);
        }
    }

    async deletePost(e, id) {
        e.preventDefault();
        try {
            let data = await Pending.postService.remove(id);

            if (!data.success) {
                notify('error', data.message);
            } else {
                this.setState({ havePostsChanged: !this.state.havePostsChanged, });
                notify('success', data.message);
            }
        } catch(err) {
            this.setState({ hasServerIssue: true });
            console.log(err);
        }
    }

    componentDidMount() {
        this.getPendingPosts();
        this.getPendingComments();
    }

    componentDidUpdate(pP, pS) {
        if (pS.havePostsChanged !== this.state.havePostsChanged) {
            console.log('yo, no infinite loops!');
            this.getPendingPosts();
        } else if (pS.haveCommentsChanged !== this.state.haveCommentsChanged) {
            console.log('yo, no infinite loops!');
            this.getPendingComments();
        }
    }

    render() {
        const { comments, posts, hasFetched, hasServerIssue } = this.state;
        const { isAdmin } = this.props;

        if (!hasFetched) {
            return <div>Loading...</div>;
        }

        if (hasServerIssue) {
            return <ServerNotResponding/>;
        }

        return (
            <Fragment>
                <div>
                    <ErrorBoundary>
                    <h3>Pending Posts:</h3>
                    <div className="cards-layout flex">
                        {
                            posts.length
                            ? (
                                posts.map(p => 
                                    <Post key={p._id}
                                        {...this.props}
                                        author={p.creator.username}
                                        isAdmin={isAdmin}
                                        title={p.title}
                                        content={p.content}
                                        imageUrl={p.imageUrl}
                                        id={p._id}
                                        status={p.status}
                                        deletePost={this.deletePost}
                                        approvePost={this.approvePost}
                                    />)
                            ) : (
                                <p>No posts to approve for now.</p>
                            )
                        }
                    </div>
                    </ErrorBoundary>
                </div>
                <div>
                    <ErrorBoundary>
                    <h3>Pending Comments:</h3>
                    <ul className="comments">
                        {
                            comments.length
                            ? (
                                comments.map(c => 
                                    <Comment key={c._id}
                                        {...this.props}
                                        author={c.creator.username}
                                        isAdmin={isAdmin}
                                        content={c.content}
                                        id={c._id}
                                        creatorId={c.creator._id}
                                        status={c.status}
                                        deleteComment={this.deleteComment}
                                        approveComment={this.approveComment}
                                    />)
                            ) : (
                                <li className="no-comment" >No comments to approve for now.</li>
                            )
                        }
                    </ul>
                    </ErrorBoundary>
                </div>
            </Fragment>
        )
    }
}

const PendingWithUserContext = (props) => {
    return (
        <UserConsumer>
            {
                (user) => (
                    <Pending
                        {...props}
                        isAdmin={user.isAdmin}
                    />
                )
            }
        </UserConsumer>
    )
}

export default withError(PendingWithUserContext);