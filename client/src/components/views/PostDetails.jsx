import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PostService from '../../services/post';
import notify from '../../helpers/notifier';

class PostDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            post: {},
            hasFetched: false,
            isAuthor: false,
            hasError: false,
        }

        this.deletePost = this.deletePost.bind(this);
    }

    static service = new PostService();

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    deletePost() {
        const postId = this.props.match.params.postId;
        alert(postId)
        PostDetails.service
            .remove(postId)
            .then((res) => {
                notify('success', res.message)
                this.props.history.push('/');
            })
            .catch(err => console.log(err));
    }

    componentDidMount () {
        const postId = this.props.match.params.postId;
        PostDetails.service
            .getById(postId)
            .then(data => {
                const isAuthor = data.post.creator._id === localStorage.getItem('userId') ? true : false;
                this.setState({
                    post: data.post,
                    hasFetched: !this.state.hasFetched,
                    isAuthor,
                })
            })
            .catch(err => console.log(err));
    }

    componentDidCatch(error, info) {
        if (this.state.hasError) {
            console.log(error, info);
        }
    }

    render() {
        const { post, hasFetched, isAuthor, hasError } = this.state;

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
                            <div>Comments:</div>
                            {
                                post.comments.length
                                ? (
                                    post.comments.forEach(c => <div>{c}</div>)
                                ) : (
                                    <div>No comments yet...</div>
                                )
                            }
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
                                ) : null
                            }
                        </section>
                    )
                }
            </article>
        )
    }
}

export default PostDetails;