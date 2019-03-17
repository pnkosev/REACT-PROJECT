import React from 'react';
import Input from '../common/Input';

//import withError from '../hocs/WithError';
import withForm from '../hocs/WithForm';

import commentModel from '../../helpers/models/commentModel';

const CreateComment = (props) => {
    return (<form onSubmit={props.handleFormSubmit}>
                <Input
                    inputType={false}
                    name="content"
                    type="text"
                    value={props.content}
                    onChange={props.handleChange}
                    label="Content"
                />
                <br/>
                <input type="submit" className="btn btn-primary" value="Comment" />
            </form>)
}

const WithFormCreateComment = withForm(CreateComment, commentModel);

export default WithFormCreateComment
