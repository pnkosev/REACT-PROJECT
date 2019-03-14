import React, { Component, Fragment } from 'react';
import CommentService from '../../../services/comment';
import notify from '../../../helpers/data/notifier';
import ServerNotResponding from '../Issue/SeverNotResponding';
import Comment from '../Comment/Comment';
import ErrorBoundary from '../../hocs/ErrorBoundary';
import PostService from '../../../services/post';
import Post from '../Post/Post';
import { UserConsumer } from '../../contexts/UserContext';

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
        try {
            let data = await Pending.commentService.approveComment(id);

            if (!data.success) {
                notify('error', data.message);
            } else {
                this.setState({ haveCommentsChanged: true, });
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
            let data = await Pending.commentService.deleteComment(id);

            if (!data.success) {
                notify('error', data.message);
            } else {
                this.setState({ haveCommentsChanged: true, });
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
            let data = await Pending.commentService.getPendingComments();

            if (!data.success) {
                notify('error', data.message);
            } else {
                this.setState({
                    comments: data.comments,
                    haveCommentsChanged: false,
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
                    havePostsChanged: false,
                    hasFetched: true,
                });
            }
        } catch(err) {
            this.setState({ hasServerIssue: true });
            console.log(err);
        }
    }

    async approvePost(id) {
        try {
            let data = await Pending.postService.approvePost(id);

            if (!data.success) {
                notify('error', data.message);
            } else {
                this.setState({ havePostsChanged: true, });
                notify('success', data.message);
                //this.getPendingPosts();
            }
        }   catch(err) {
            this.setState({ hasServerIssue: true });
            console.log(err);
        }
    }

    async deletePost(id) {
        try {
            let data = await Pending.postService.remove(id);

            if (!data.success) {
                notify('error', data.message);
            } else {
                this.setState({ havePostsChanged: true, });
                //this.getPendingPosts();
                notify('success', data.message);
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
        this.getPendingPosts();
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
            return <ServerNotResponding/>
        }

        return (
            <Fragment>
                <div>
                    <ErrorBoundary>
                    <h3>Pending Posts:</h3>
                    <ul>
                        {
                            posts.length
                            ? (
                                posts.map(p => 
                                    <Post key={p._id}
                                        author={p.creator.username}
                                        isAdmin={isAdmin}
                                        title={p.title}
                                        content={p.content}
                                        id={p._id}
                                        status={p.status}
                                        deletePost={() => this.deletePost(p._id)}
                                        approvePost={() => this.approvePost(p._id)}
                                    />)
                            ) : (
                                <li>No posts to approve for now.</li>
                            )
                        }
                    </ul>
                    </ErrorBoundary>
                </div>
                <div>
                    <ErrorBoundary>
                    <h3>Pending Comments:</h3>
                    <ul>
                        {
                            comments.length
                            ? (
                                comments.map(c => 
                                    <Comment key={c._id}
                                        author={c.creator.username}
                                        isAdmin={isAdmin}
                                        content={c.content}
                                        id={c._id}
                                        creatorId={c.creator._id}
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

export default PendingWithUserContext;