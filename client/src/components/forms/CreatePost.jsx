import React from 'react';
import Input from '../common/Input';
import withForm from '../hocs/WithForm';
import postModel from '../../helpers/models/postModel';

const CreatePost = (props) => {
    return (
        <div className="container">
            <h1>Create Post</h1>
            <form onSubmit={props.handleFormSubmit}>
                <Input
                    inputType="input"
                    name="title"
                    value={props.title}
                    onChange={props.handleChange}
                    label="Title"
                />
                <Input
                    inputType={false}
                    name="content"
                    type="text"
                    value={props.content}
                    onChange={props.handleChange}
                    label="Content"
                />
                <br/>
                <input type="submit" className="btn btn-primary" value="Create Post" />
            </form>
        </div>
    );
}

const WithFormCreatePost = withForm(CreatePost, postModel);
export default WithFormCreatePost;