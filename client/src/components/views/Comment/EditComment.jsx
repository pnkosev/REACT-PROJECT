import React, { Component } from 'react';

import Input from '../../common/Input';

import notify from '../../../helpers/data/notifier';
import CommentService from '../../../services/comment';
import { UserConsumer } from '../../contexts/UserContext';
import withError from '../../hocs/WithError';

import validateForm from '../../../helpers/formValidators/commentValidator';

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
        const { content } = this.state;

        let validationResult = validateForm({content});

        if (!validationResult.success) {
            notify('error', validationResult.message, validationResult.errors);
            return;
        }

        try {
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
                const prevPath = this.props.location.state.prevPath;
                notify('success', res.message);
                this.props.history.push(prevPath);
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
        const { isAdmin } = this.props;
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
                    {
                        isAdmin
                        ? (<input type="submit" className="btn btn-primary" value="Edit and Approve" />)
                        : (<input type="submit" className="btn btn-primary" value="Edit Comment" />)
                    }
                </form>
            </div>
        )
    }
}

const EditCommentWithContext = (props) => {
    return (
        <UserConsumer>
            {
                (user) => (
                    <EditComment
                        {...props}
                        isAdmin={user.isAdmin}
                    />
                )
            }
        </UserConsumer>
    )
}

export default withError(EditCommentWithContext);