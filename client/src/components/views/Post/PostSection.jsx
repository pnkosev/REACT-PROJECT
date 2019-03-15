import React from 'react';
import { NavLink } from 'react-router-dom';

import withError from '../../hocs/WithError';

import '../../../styles/post-section.css';

const PostSection = (props) => {
    const { post, isAuthor, isAdmin, isLoggedIn, deletePost, likePost, hatePost } = props;

    return (
        <article className="post-details">
            <main>
                <div className="media">
                    <img src={post.imageUrl} alt={post.title} />
                </div>
                <div className="content">
                    <h3>{post.title}</h3>
                    <p>{post.content}</p>
                    <p className="author">{post.creator.username}</p>
                </div>
                {
                    isAuthor || isAdmin
                        ? (
                            <div className="btns-author">
                                <NavLink to={`/post/update/${post._id}`} className="btn" >Edit</NavLink>
                                <button onClick={() => deletePost(post._id)} className="btn" >Delete</button>
                            </div>
                        ) : (
                            null
                        )
                }
            </main>
            <aside>
                <div className="likes-hates">
                    <div className="stats">
                        <span>Likes: {post.likes.length}</span>
                        <span>Hates: {post.hates.length}</span>
                    </div>
                    <div className="btns">
                    {
                    isLoggedIn
                        ? (
                            <div>
                                <button onClick={() => likePost(post._id)}>Like</button>
                                <button onClick={() => hatePost(post._id)}>Hate</button>
                            </div>
                        ) : (
                            null
                        )
                    }
                    </div>
                </div>
                <div className="ppl-likin">
                    <h5>PPL likin':</h5>
                    <ul>
                        {
                            post.likes.length
                                ? (
                                    post.likes.map((user) => <li key={user._id}>{user.username}</li>
                                    )
                                ) : (
                                    <li>Nobody has liked this post yet! Be patient though...</li>
                                )
                        }
                    </ul>
                </div>
                <div className="ppl-hatin">
                    <h5>PPL hatin':</h5>
                    <ul>
                        {
                            post.hates.length
                                ? (
                                    post.hates.map((user) => <li key={user._id}>{user.username}</li>
                                    )
                                ) : (
                                    <li>Nobody has hated this post yet! Be patient though...</li>
                                )
                        }
                    </ul>
                </div>
            </aside>
        </article>
    );
}
export default withError(PostSection);