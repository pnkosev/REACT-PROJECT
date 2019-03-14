import React, { Component } from 'react';
import { getProfile } from '../../../services/auth';
import ServerNotResponding from '../Issue/SeverNotResponding';
import withError from '../../hocs/WithError';
import notify from '../../../helpers/data/notifier';
import Post from '../Post/Post';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            hasFetched: false,
            hasServerIssue: false,
        }
    }

    componentDidMount() {
        getProfile()
            .then((data) => {
                this.setState({
                    posts: data.posts,
                    hasFetched: true,
                });
                notify('success', data.message);
            })
            .catch((err) => {
                this.setState({ hasServerIssue: true });
                console.log(err);
            })
    }

    render() {
        const { posts, hasFetched, hasServerIssue } = this.state;
        const username = localStorage.getItem('username');

        if (hasServerIssue) {
            return <ServerNotResponding />;
        }

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
                            <Post key={p._id}
                            title={p.title}
                            content={p.content}
                            id={p._id}
                            author={p.creator.username}
                        />))
                        : <h4>Currently no posts...</h4>
                }
            </div>
        )
    }
}

export default withError(Profile);