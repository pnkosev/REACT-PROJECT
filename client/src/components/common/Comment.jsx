import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';


const Comment = ({ content, username, id, creator, status, isAdmin, deleteComment, approveComment }) => {
    return (
        <li key={id}>
            <p>{content}</p>
            <p>Author: {username}</p>
            {
                (creator.toString() === localStorage.getItem('userId') && !isAdmin)
                ? (
                    <button  onClick={() => deleteComment(id)}>
                        Delete
                    </button>
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
                                <button><Link to={`/comment/update/${id}`}>Edit</Link></button>
                            </Fragment>
                        ) : (
                            <Fragment>
                                <button onClick={() => deleteComment(id)}>Delete</button>
                                <button><Link to={`/comment/update/${id}`}>Edit</Link></button>
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