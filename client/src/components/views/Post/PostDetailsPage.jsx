import React, { Component, Fragment } from 'react';
import PostService from '../../../services/post';
import notify from '../../../helpers/data/notifier';
import CommentSection from '../Comment/CommentSection';
import ServerNotResponding from '../Issue/SeverNotResponding';
import ErrorBoundary from '../../hocs/ErrorBoundary';
import CommentService from '../../../services/comment';
import { UserConsumer } from '../../contexts/UserContext';
import PostSection from './PostSection';
import commentValidateForm from '../../../helpers/formValidators/commentValidator';

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

        this.updateComms = this.updateComms.bind(this);
        //this.postComment = this.postComment.bind(this);
    }

    static postService = new PostService();
    static commentService = new CommentService();

    // async postComment(creds, id) {
    //     return await PostDetails.commentService.postComment(creds, id);
    // }

    updateComms(res) {
        if (res.comment.status === 'Approved') {
            this.setState({
                comments: [...this.state.comments, res.comment]
            })
        }
    }

    deletePost(id) {
        PostDetails.postService
            .remove(id)
            .then((res) => {
                if (!res.success) {
                    throw new Error(res.message);
                } else {
                    notify('success', res.message)
                    this.props.history.push('/');
                }
            })
            .catch(err => {
                console.log(err);
                this.setState({ hasServerIssue: true });
            });
    }

    async likePost(id) {
        try {
            let res = await PostDetails.postService.postLike(id);

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

    async hatePost(id) {
        try {
            let res = await PostDetails.postService.postHate(id);

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
                throw new Error(data.message);
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
        const { isLoggedIn } = this.props;
        const postId = this.props.match.params.postId;
        PostDetails.postService
            .getById(postId)
            .then(data => {
                let isAuthor;
                if (isLoggedIn) {
                    isAuthor = data.post.creator._id === localStorage.getItem('userId') ? true : false;
                }
                this.setState({
                    post: data.post,
                    isAuthor,
                    comments: data.post.comments,
                    hasFetched: true,
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
            <section>
                <div>Some detailed stuff</div>
                {
                    !hasFetched
                        ? (<h2>Loading...</h2>)
                        : (<Fragment>
                            <PostSection
                                {...this.props}
                                post={post}
                                isAuthor={isAuthor}
                                isAdmin={isAdmin}
                                isLoggedIn={isLoggedIn}
                                deletePost={this.deletePost}
                                likePost={this.likePost}
                                hatePost={this.hatePost}
                            />
                            {
                                isLoggedIn
                                    ? (
                                        <ErrorBoundary>
                                            <CommentSection
                                                {...this.props}
                                                isAdmin={isAdmin}
                                                postId={post._id}
                                                comments={comments}
                                                deleteComment={this.deleteComment}
                                                postComment={(creds, id) => PostDetails.commentService.postComment(creds, id)}
                                                updateComms={(res) => this.updateComms(res)}
                                                validateForm={commentValidateForm}
                                            />
                                        </ErrorBoundary>
                                    ) : (
                                        null
                                    )
                            }
                        </Fragment>)
                }
            </section>
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