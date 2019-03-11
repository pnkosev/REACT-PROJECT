import React, { Component } from 'react';

import Input from '../common/Input';
import Comment from '../common/Comment';

import notify from '../../helpers/notifier';
import CommentService from '../../services/comment';

class CommentSection extends Component {
    constructor(props) {
        super(props);

        this.state = {
            content: '',
            comments: [],
            isAdmin: false,
            error: {}
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.deleteComment = this.deleteComment.bind(this);
    }

    static service = new CommentService();

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
            let res = await CommentSection.service.postComment(postId, {content});

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
                this.setState({
                    content: '',
                })
                notify('success', res.message);
            }
        } catch(err) {
            console.log(err);
        };
    }

    async deleteComment(id) {
        let comments = this.state.comments.slice();
        let index = comments.findIndex(c => c._id === id);
        comments.splice(index, 1);
        
        try {
            let data = await CommentSection.service.deleteComment(id);

            if (!data.success) {
                notify('error', data.message);
                return;
            } else {
                this.setState({
                    comments: comments,
                })
                notify('success', data.message);
                return;
            }

        } catch(err) {
            console.log(err);
        }
    }

    componentDidMount() {
        const isAdmin = (localStorage.getItem('isAdmin') === 'true');
        this.setState({
            comments: this.props.comments,
            isAdmin,
        })
    }

    render() {
        const { comments, isAdmin } = this.state;
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
                <h4>Comments:</h4>
                    {
                        comments.length
                        ? (comments.map(c =>
                            <Comment
                                deleteComment={(id) => this.deleteComment(id)}
                                key={c._id}
                                id={c._id}
                                content={c.content}
                                creator={c.creator}
                                isAdmin={isAdmin}
                            />)
                        ) : <h5>No comments yet...</h5>
                    }
                </div>
            </div>
         );
    }
}
export default CommentSection;