import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PostService from '../../../services/post';
import notify from '../../../helpers/data/notifier';
import CommentSection from '../Comment/CommentSection';
import ServerNotResponding from '../Issue/SeverNotResponding';
import ErrorBoundary from '../../hocs/ErrorBoundary';
import CommentService from '../../../services/comment';
import { UserConsumer } from '../../contexts/UserContext';

class PostDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            post: {},
            hasFetched: false,
            isAuthor: false,
            comments: [],
            hasServerIssue: false,
        }

        this.deletePost = this.deletePost.bind(this);
        this.likePost = this.likePost.bind(this);
        this.hatePost = this.hatePost.bind(this);
        this.deleteComment = this.deleteComment.bind(this);
    }

    static postService = new PostService();
    static commentService = new CommentService();

    async deletePost() {
        const postId = this.props.match.params.postId;

        try {
            PostDetails.postService
                .remove(postId)
                .then((res) => {
                    if (!res.success) {
                        notify('error', res.message);
                        return;
                    } else {
                        notify('success', res.message)
                        this.props.history.push('/');
                    }
                })
        } catch (err) {
            console.log(err);
            this.setState({ hasServerIssue: true });
        }
    }

    async likePost() {
        const postId = this.props.match.params.postId;

        try {
            let res = await PostDetails.postService.postLike(postId);

            if (!res.success) {
                notify('error', res.message);
                return;
            } else {
                notify('success', res.message);
                this.setState({ post: res.post, hasFetched: true });
            }
        } catch (err) {
            console.log(err);
            this.setState({ hasServerIssue: true });
        }
    }

    async hatePost() {
        const postId = this.props.match.params.postId;

        try {
            let res = await PostDetails.postService.postHate(postId);

            if (!res.success) {
                notify('error', res.message);
                return;
            } else {
                notify('success', res.message)
                this.setState({ post: res.post, hasFetched: true });
            }
        } catch (err) {
            console.log(err);
            this.setState({ hasServerIssue: true });
        }
    }

    async deleteComment(id) {
        let comments = this.state.comments.slice();
        let index = comments.findIndex(c => c._id === id);
        comments.splice(index, 1);

        try {
            let data = await PostDetails.commentService.deleteComment(id);

            if (!data.success) {
                notify('error', data.message);
                return;
            } else {
                this.setState({ comments })
                notify('success', data.message);
            }

        } catch (err) {
            this.setState({ hasServerIssue: true });
            console.log(err);
        }
    }

    componentDidMount() {
        const postId = this.props.match.params.postId;
        PostDetails.postService
            .getById(postId)
            .then(data => {
                let isAuthor;
                if (localStorage.getItem('userId')) {
                    isAuthor = data.post.creator._id === localStorage.getItem('userId') ? true : false;
                }
                this.setState({
                    post: data.post,
                    hasFetched: true,
                    isAuthor,
                    comments: data.post.comments,
                })
            })
            .catch(err => {
                console.log(err);
                this.setState({ hasServerIssue: true });
            });
    }

    render() {
        const { post, hasFetched, isAuthor, comments, hasServerIssue } = this.state;
        const { isAdmin, isLoggedIn } = this.props;

        if (hasServerIssue) {
            return <ServerNotResponding />
        }

        return (
            <article>
                <div>Some detailed stuff</div>
                {
                    !hasFetched
                        ? (<h2>Loading...</h2>)
                        : (
                            <section>
                                <h2>Title: {post.title}</h2>
                                <div>{post.content}</div>
                                {
                                    isAuthor || isAdmin
                                        ? (
                                            <section>
                                                <button>
                                                    <Link to={`/post/update/${post._id}`}>Edit</Link>
                                                </button>
                                                <button type="submit" onClick={this.deletePost}>
                                                    Delete
                                                </button>
                                            </section>
                                        ) : (
                                            null
                                        )
                                }
                                <span>Likes: {post.likes.length}</span>
                                <span>Hates: {post.hates.length}</span>
                                <br />
                                {
                                    isLoggedIn
                                        ? (
                                            <Fragment>
                                                <button onClick={this.likePost}>Like</button>
                                                <button onClick={this.hatePost}>Hate</button>
                                            </Fragment>
                                        ) : (
                                            null
                                        )
                                }
                                <div>PPL likin'</div>
                                <ul>
                                    {
                                        post.likes.length
                                            ? (
                                                post.likes.map((user) => <li key={user._id}>{user.username}</li>
                                                )
                                            ) : (
                                                <li>Nobody has liked this post yet!</li>
                                            )
                                    }
                                </ul>
                                <div>PPL hatin'</div>
                                <ul>
                                    {
                                        post.hates.length
                                            ? (
                                                post.hates.map((user) => <li key={user._id}>{user.username}</li>
                                                )
                                            ) : (
                                                <li>Nobody has hated this post yet!</li>
                                            )
                                    }
                                </ul>
                                {
                                    isLoggedIn
                                        ? (
                                            <ErrorBoundary>
                                                <CommentSection
                                                    isAdmin={isAdmin}
                                                    postId={post._id}
                                                    comments={comments}
                                                    deleteComment={(id) => this.deleteComment(id)}
                                                />
                                            </ErrorBoundary>
                                        ) : (
                                            null
                                        )
                                }
                            </section>
                        )
                }
            </article>
        )
    }
}

const PostDetailsWithUserContext = (props) => {
    return (
        <UserConsumer>
            {
                (user) => (
                    <PostDetails
                        {...props}
                        isLoggedIn={user.isLoggedIn}
                        isAdmin={user.isAdmin}
                    />
                )
            }
        </UserConsumer>
    )
}

export default PostDetailsWithUserContext;