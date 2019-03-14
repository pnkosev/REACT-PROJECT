import React, { Component } from 'react';

import Input from '../../common/Input';
import Comment from './Comment';

import notify from '../../../helpers/data/notifier';
import CommentService from '../../../services/comment';
import ErrorBoundary from '../../hocs/ErrorBoundary';

import ServerNotResponding from '../Issue/SeverNotResponding';

class CommentSection extends Component {
    constructor(props) {
        super(props);

        this.state = {
            content: '',
            error: {},
            hasServerIssue: false,
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
        const content = this.state.content;
        
        // TODO validate form
        // let validationResult = this.props.validateForm(comment);
        
        // if (!validationResult.success) {
        //     notify('error', validationResult.message, validationResult.errors);
        //     return;
        // }
        
        try {
            const postId = this.props.postId;
            let res = await CommentSection.commentService.postComment(postId, {content});

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
                this.setState({ content: '' })
                notify('success', res.message);
            }
        } catch(err) {
            this.setState({ hasServerIssue: true });
            console.log(err);
        };
    }

    render() {
        const { hasServerIssue } = this.state;
        const { isAdmin, comments, deleteComment } = this.props;

        if (hasServerIssue) {
            return <ServerNotResponding />
        }

        return (
            <div className="container">
                <h2>Leave a comment</h2>
                <h4>Comment:</h4>
                <form onSubmit={this.handleFormSubmit}>
                    <Input
                        inputType={false}
                        name="content"
                        type="text"
                        value={this.state.content}
                        onChange={this.handleChange}
                        label="Content"
                        />
                    <br/>
                    <input type="submit" className="btn btn-primary" value="Comment" />
                </form>
                <div>
                <ErrorBoundary>
                    <h4>Comments:</h4>
                    {
                        comments.length
                        ? (comments.map(c =>
                            <Comment
                                author={c.creator.username}
                                deleteComment={() => deleteComment(c._id)}
                                key={c._id}
                                id={c._id}
                                content={c.content}
                                creatorId={c.creator._id}
                                isAdmin={isAdmin}
                            />)
                        ) : <h5>No comments yet...</h5>
                    }
                </ErrorBoundary> 
                </div>
            </div>
         );
    }
}
export default CommentSection;