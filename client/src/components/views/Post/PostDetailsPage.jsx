import React, { Component, Fragment } from 'react';
import PostService from '../../../services/post';
import notify from '../../../helpers/data/notifier';
import CommentSection from '../Comment/CommentSection';
import ServerNotResponding from '../Issue/SeverNotResponding';
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
            hasServerIssuePosts: false,
            hasServerIssueComms: false,
            hasGeneralServerIssue: false,
        }

        this.deletePost = this.deletePost.bind(this);
        this.likePost = this.likePost.bind(this);
        this.hatePost = this.hatePost.bind(this);

        this.deleteComment = this.deleteComment.bind(this);
        this.updateComms = this.updateComms.bind(this);
    }

    static postService = new PostService();
    static commentService = new CommentService();

    updateComms(res) {
        if (res.comment.status === 'Approved') {
            this.setState({
                comments: [...this.state.comments, res.comment]
            })
        }
    }

    async deletePost(id) {
        try {
            let res = await PostDetails.postService.remove(id);
            if (!res.success) {
                throw new Error(res.message);
            } else {
                notify('success', res.message)
                this.props.history.push('/');
            }
        } catch (err) {
            console.log(err);
            this.setState({ hasServerIssuePosts: true });
        }
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
            this.setState({ hasServerIssuePosts: true });
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
            this.setState({ hasServerIssuePosts: true });
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
            console.log(err);
            this.setState({ hasServerIssueComms: true });
        }
    }

    async getData() {
        const { isLoggedIn } = this.props;
        const postId = this.props.match.params.postId;
        try {
            let data = await PostDetails.postService.getById(postId);
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
        } catch (err) {
            console.log(err);
            this.setState({ hasGeneralServerIssue: true });
        }
    }

    componentDidMount() {
        this.getData();
    }

    render() {
        const { post, hasFetched, isAuthor, comments, hasServerIssuePosts, hasServerIssueComms, hasGeneralServerIssue } = this.state;
        const { isAdmin, isLoggedIn } = this.props;

        if (hasGeneralServerIssue) {
            return <ServerNotResponding />;
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
                                serverIssue={hasServerIssuePosts}
                            />
                            {
                                isLoggedIn
                                    ? (
                                        <CommentSection
                                            {...this.props}
                                            isAdmin={isAdmin}
                                            postId={post._id}
                                            comments={comments}
                                            deleteComment={this.deleteComment}
                                            postComment={(creds, id) => PostDetails.commentService.postComment(creds, id)}
                                            updateComms={(res) => this.updateComms(res)}
                                            validateForm={commentValidateForm}
                                            serverIssue={hasServerIssueComms}
                                        />
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