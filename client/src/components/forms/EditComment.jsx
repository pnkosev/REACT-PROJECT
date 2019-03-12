import React, { Component } from 'react';

import Input from '../common/Input';

import notify from '../../helpers/notifier';
import CommentService from '../../services/comment';

class EditComment extends Component {
    constructor(props) {
        super(props);

        this.state = {
            content: '',
            error: {}
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    static commentService = new CommentService();

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    async handleFormSubmit(e) {
        e.preventDefault();

        // const post = Object.keys(this.state).reduce((object, key) => {
        //     if (key !== 'error') {
        //         object[key] = this.state[key]
        //     }
        //     return object;
        // }, {});

        // let validationResult = this.props.validateForm(post);

        // if (!validationResult.success) {
        //     notify('error', validationResult.message, validationResult.errors);
        //     return;
        // }

        try {
            const { content } = this.state;
            const commentId = this.props.match.params.commentId;
            let res = await EditComment.commentService.updateComment(commentId, {content});

            if (!res.success) {
                if (res.errors) {
                    const errors = (res.errors).reduce((obj, key) => {
                        obj[key['param']] = key['msg']
                        return obj;
                    }, {})
                    this.setState({ error: errors });
                    notify('error', 'Invalid input', errors);
                    return;
                } else {
                    notify('error', res.message);
                    return;
                }
            } else {
                notify('success', res.message);
                this.props.history.push('/comment/pending');
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    componentDidMount() {
        const commentId = this.props.match.params.commentId;
        EditComment.commentService
            .getCommentById(commentId)
            .then(data => {
                this.setState({
                    content: data.comment.content
                })
            })
            .catch(err => console.log(err));
    }
    render() {
        return (
            <div className="container">
                <h1>Edit Comment</h1>
                <form onSubmit={this.handleFormSubmit}>
                    <Input
                        inputType={false}
                        name="content"
                        type="text"
                        value={this.state.content}
                        onChange={this.handleChange}
                        label="Content"
                    />
                    <br />
                    <input type="submit" className="btn btn-primary" value="Edit Post" />
                </form>
            </div>
        )
    }
}

//const WithFormUpdatePost = withForm(EditPost, postModel);
export default EditComment;