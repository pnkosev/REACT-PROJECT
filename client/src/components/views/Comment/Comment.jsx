import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom';

import '../../../styles/comment.css';


const Comment = (props) => {
    const { content, author, id, creatorId, status, isAdmin, deleteComment, approveComment } = props;
    
    return (
        <li className="comment" key={id}>
            <p>{content}</p>
            <p className="author">Author: {author}</p>
            {
                (creatorId === localStorage.getItem('userId') && !isAdmin)
                ? (
                    <button  onClick={() => deleteComment(id)}>Delete</button>
                ) : (
                    null
                )
            }
            {
                isAdmin
                ? (
                    <Fragment>
                    {
                        status === 'Pending'
                        ? (
                            <Fragment>
                                <button onClick={() => approveComment(id)}>Approve</button>
                                <button onClick={() => deleteComment(id)}>Delete</button>
                                <NavLink
                                    to={{pathname: `/comment/update/${id}`, state: { prevPath: props.location.pathname }}}
                                    activeClassName="active"
                                    className="btn" 
                                >
                                    Edit
                                </NavLink>
                            </Fragment>
                        ) : (
                            <Fragment>
                                <button onClick={() => deleteComment(id)}>Delete</button>
                                <NavLink to={{pathname: `/comment/update/${id}`, state: { prevPath: props.location.pathname }}}
                                    activeClassName="active"
                                    className="btn" 
                                >
                                    Edit
                                </NavLink>
                            </Fragment>
                        )
                    }
                    </Fragment>
                ) : (
                    null
                )
            }
        </li>
    )
}

export default Comment;