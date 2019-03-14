import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom';


const Comment = ({ content, author, id, creatorId, status, isAdmin, deleteComment, approveComment }) => {
    return (
        <li key={id}>
            <p>{content}</p>
            <p>Author: {author}</p>
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
                                <button onClick={() => approveComment(id)}>Approve</button>
                                <button onClick={() => deleteComment(id)}>Delete</button>
                                <button><NavLink to={`/comment/update/${id}`} activeClassName="active">Edit</NavLink></button>
                            </Fragment>
                        ) : (
                            <Fragment>
                                <button onClick={() => deleteComment(id)}>Delete</button>
                                <button><NavLink to={`/comment/update/${id}`} activeClassName="active">Edit</NavLink></button>
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