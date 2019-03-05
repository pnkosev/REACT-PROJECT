import React, { Component } from 'react';
import Input from '../common/Input';
import withForm from '../hocs/WithForm';
import postModel from '../../helpers/models/postModel';

class EditPost extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            content: '',
        }

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    componentDidMount() {
        const postId = this.props.match.params.postId;
        this.props.getById(postId)
            .then(data => {
                const isAuthor = data.post.creator._id === localStorage.getItem('userId') ? true : false;
                if (!isAuthor) {
                    /// TODO
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
                <form onSubmit={this.props.handleFormSubmit}>
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
                    <input type="submit" className="btn btn-primary" value="Create Post" />
                </form>
            </div>
        )
    }
}

const WithFormUpdatePost = withForm(EditPost, postModel);
export default WithFormUpdatePost;