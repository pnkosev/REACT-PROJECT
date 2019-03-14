import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom';


const Post = ({ title, content, author, id, status, isAdmin, approvePost, deletePost }) => {
    return (
        <div>
            <p>Title: {title}</p>
            <p>Content: {content}</p>
            <p>Author: {author}</p>
            {
                isAdmin
                ? (
                    <Fragment>
                    {
                        status === 'Pending'
                        ? (
                            <Fragment>
                                <button onClick={() => approvePost(id)}>Approve</button>
                                <button onClick={() => deletePost(id)}>Delete</button>
                                <button><NavLink to={`/post/update/${id}`} activeClassName="active">Edit</NavLink></button>
                            </Fragment>
                        ) : (
                            <button><NavLink to={"/post/" + id} activeClassName="active">Details</NavLink></button>
                        )
                    }
                    </Fragment>
                ) : (
                    <button><NavLink to={"/post/" + id} activeClassName="active">Details</NavLink></button>
                )
            }
        </div>
    )
}

export default Post;