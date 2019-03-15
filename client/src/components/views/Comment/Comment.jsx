import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom';

import '../../../styles/comment.css';


const Comment = ({ content, author, id, creatorId, status, isAdmin, deleteComment, approveComment }) => {
    return (
        <li className="comment" key={id}>
            <p>{content}</p>
            <p className="author">Author: {author}</p>
            {
                (creatorId.toString() === localStorage.getItem('userId') && !isAdmin)
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
                                <button onClick={(e) => approveComment(e, id)}>Approve</button>
                                <button onClick={(e) => deleteComment(e, id)}>Delete</button>
                                <NavLink to={`/comment/update/${id}`} activeClassName="active" className="btn" >Edit</NavLink>
                            </Fragment>
                        ) : (
                            <Fragment>
                                <button onClick={(e) => deleteComment(e, id)}>Delete</button>
                                <NavLink to={`/comment/update/${id}`} activeClassName="active" className="btn" >Edit</NavLink>
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