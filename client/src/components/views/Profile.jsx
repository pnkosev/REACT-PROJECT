import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getProfile } from '../../services/auth';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            hasFetched: false,
        }
    }

    componentDidMount() {
        getProfile()
            .then((data) => {
                this.setState({
                    posts: data.posts,
                    hasFetched: true,
                })
            })
            .catch((err) => {
                console.log(err);
            })
    }

    render() {
        const { posts, hasFetched } = this.state;
        const username = localStorage.getItem('username');

        return (
            <div>
                <h2>{username}'s profile</h2>
                {
                    !hasFetched
                        ? (<h3>Loading...</h3>)
                        : (<h3>Your posts:</h3>)
                }
                <div>
                    Contribution:
                    Number of posts: {posts.length}
                </div>
                {
                    posts.length
                        ? posts.map(p => (
                            <article key={p._id}>
                                <h2>{p.title}</h2>
                                <div>{p.content}</div>
                                <button>
                                    <Link to={"/post/" + p._id}>Details</Link>
                                </button>
                            </article>))
                        : <h4>Currently no posts...</h4>
                }
            </div>
        )
    }
}

export default Profile;