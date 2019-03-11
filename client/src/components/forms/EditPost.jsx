import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import Input from '../common/Input';

import notify from '../../helpers/notifier';
import PostService from '../../services/post';

class EditPost extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            content: '',
            error: {}
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    static service = new PostService();

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    async handleFormSubmit(e) {
        e.preventDefault();

        const post = Object.keys(this.state).reduce((object, key) => {
            if (key !== 'error') {
                object[key] = this.state[key]
            }
            return object;
        }, {});

        let validationResult = this.props.validateForm(post);

        if (!validationResult.success) {
            notify('error', validationResult.message, validationResult.errors);
            return;
        }

        try {
            const postId = this.props.match.params.postId;
            const res = await EditPost.service.update(postId, post);

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
                
                //throw new Error(errors)
            } else {
                notify('success', res.message);
                this.props.history.push('/');
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    componentDidMount() {
        const postId = this.props.match.params.postId;
        EditPost.service
            .getById(postId)
            .then(data => {
                const isAuthor = data.post.creator._id === localStorage.getItem('userId') ? true : false;
                if (!isAuthor) {
                    return <Redirect to="/user/login" />
                }
                this.setState({
                    title: data.post.title,
                    content: data.post.content
                })
            })
            .catch(err => console.log(err));
    }
    render() {
        return (
            <div className="container">
                <h1>Edit Post</h1>
                <form onSubmit={this.handleFormSubmit}>
                    <Input
                        inputType="input"
                        name="title"
                        value={this.state.title}
                        onChange={this.handleChange}
                        label="Title"
                    />
                    <Input
                        inputType={false}
                        name="content"
                        type="text"
                        value={this.state.content}
                        onChange={this.handleChange}
                        label="Content"
                    />
                    <br/>
                    <input type="submit" className="btn btn-primary" value="Edit Post" />
                </form>
            </div>
        )
    }
}

//const WithFormUpdatePost = withForm(EditPost, postModel);
export default EditPost;