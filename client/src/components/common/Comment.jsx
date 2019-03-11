import React from 'react';


const Comment = ({ content, id, creator, isAdmin, deleteComment }) => {
    return (
        <article>
            <p>{content}</p>
            {
                (creator === localStorage.getItem('userId') || isAdmin)
                ? (
                    <button  onClick={() => deleteComment(id)}>
                        Delete
                    </button>
                ) : (
                    null
                )
            }
        </article>
    )
}

export default Comment;