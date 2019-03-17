import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom';

import '../../../styles/post.css';


const Post = (props) => {
    const { title, content, imageUrl, author, id, status, isAdmin, approvePost, deletePost } = props;

    return (
        <article>
            <div className="post-card">
                <div className="media">
                    <img src={imageUrl} alt={title} />
                </div>
                <div className="content">
                    <h3>{title}</h3>
                    <p className="cnt">{content}</p>
                    <p className="author">{author}</p>
                    {
                        isAdmin
                        ? (
                            <Fragment>
                            {
                                status === 'Pending'
                                ? (
                                    <div className="btns">
                                        <a href="/" onClick={(e) => approvePost(e, id)}>Approve</a>
                                        <a href="/" onClick={(e) => deletePost(e, id)}>Delete</a>
                                        <NavLink
                                            to={{pathname: `/post/update/${id}`, state: { prevPath: props.location.pathname }}}
                                            activeClassName="active"
                                        >
                                            Edit
                                        </NavLink>
                                    </div>
                                ) : (
                                    <NavLink to={"/post/details/" + id} activeClassName="active">Details</NavLink>
                                )
                            }
                            </Fragment>
                        ) : (
                            <NavLink to={"/post/details/" + id} activeClassName="active">Details</NavLink>
                        )
                    }
                </div>
            </div>
        </article>
    )
}

export default Post;