import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PostService from '../../services/post';
import notify from '../../helpers/notifier';
import CommentSection from '../forms/CommentSection';

class PostDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            post: {},
            hasFetched: false,
            isAuthor: false,
            user: false,
            comments: [],
            hasError: false,
        }

        this.deletePost = this.deletePost.bind(this);
        this.likePost = this.likePost.bind(this);
        this.hatePost = this.hatePost.bind(this);
    }

    static service = new PostService();

    async deletePost() {
        const postId = this.props.match.params.postId;

        try {
            PostDetails.service
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
        }
    }

    async likePost() {
        const postId = this.props.match.params.postId;

        try {
            let res = await PostDetails.service.postLike(postId);

            if (!res.success) {
                notify('error', res.message);
                return;
            } else {
                notify('success', res.message);
                this.setState({ post: res.post });
            }
        } catch (err) {
            console.log(err);
        }
    }

    async hatePost() {
        const postId = this.props.match.params.postId;

        try {
            let res = await PostDetails.service.postHate(postId);

            if (!res.success) {
                notify('error', res.message);
                return;
            } else {
                notify('success', res.message)
                this.setState({ post: res.post });
            }
        } catch (err) {
            console.log(err);
        }
    }

    componentDidMount() {
        const postId = this.props.match.params.postId;
        PostDetails.service
            .getById(postId)
            .then(data => {
                let isAuthor = false;
                let user;
                if (localStorage.getItem('userId')) {
                    isAuthor = data.post.creator._id === localStorage.getItem('userId') ? true : false;
                    user = true;
                }
                this.setState({
                    post: data.post,
                    hasFetched: !this.state.hasFetched,
                    isAuthor,
                    user,
                    comments: data.post.comments,
                })
            })
            .catch(err => console.log(err));
    }

    render() {
        const { post, hasFetched, isAuthor, user, comments, hasError } = this.state;

        if (hasError) {
            return <div>Please excuse us, we are working on the problem...</div>
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
                                <span>Likes: {post.likes.length}</span>
                                <span>Hates: {post.hates.length}</span>
                                <br />
                                {
                                    user 
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
                                    isAuthor
                                        ? (
                                            <section>
                                                <button>
                                                    <Link to={`update/${post._id}`}>Edit</Link>
                                                </button>
                                                <button type="submit" onClick={this.deletePost}>
                                                    Delete
                                                </button>
                                            </section>
                                        ) : (
                                            null
                                        )
                                }
                                {
                                    user
                                    ? (
                                        <CommentSection postId={post._id} comments={comments} />
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

export default PostDetails;