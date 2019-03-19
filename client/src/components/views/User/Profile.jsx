import React, { Component, Fragment } from 'react';

import notify from '../../../helpers/data/notifier';
import { getProfile } from '../../../services/auth';
import withError from '../../hocs/WithError';

import ServerNotResponding from '../Issue/SeverNotResponding';
import Post from '../../post/Post';
import { UserConsumer } from '../../contexts/UserContext';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            hasFetched: false,
            hasServerIssue: false,
        }
    }

    async getdata() {
        try {
            let data = await getProfile();
            if (!data.success) {
                throw new Error(data.message);
            } else {
                this.setState({
                    posts: data.posts,
                    hasFetched: true,
                });
                notify('success', data.message);
            }
        } catch (err) {
            console.log(err);
            this.setState({ hasServerIssue: true });
        }
    }

    componentDidMount() {
        this.getdata();
    }

    render() {
        const { posts, hasFetched, hasServerIssue } = this.state;
        const { username } = this.props;

        if (hasServerIssue) {
            return <ServerNotResponding />;
        }

        return (
            <div>
                <h2>{username}'s profile</h2>
                <div>
                    <p>Contribution:</p>
                    Number of posts: {posts.length}
                </div>
                {
                    !hasFetched
                        ? (
                            <h3>Loading...</h3>
                        ) : (
                            <Fragment>
                                <h3>Your posts:</h3>
                                <div className="cards-layout flex">
                                {
                                    posts.length
                                        ? posts.map(p => (
                                            <Post key={p._id}
                                            title={p.title}
                                            content={p.content}
                                            imageUrl={p.imageUrl}
                                            id={p._id}
                                            author={p.creator.username}
                                        />))
                                        : <h4>Currently no posts...</h4>
                                }
                                </div>
                            </Fragment>
                        )
                }
            </div>
        )
    }
}

const WithUserContextProfile = (props) => {
    return(
        <UserConsumer>
            {
                ({ username }) => (
                    <Profile 
                        {...props}
                        username={username}
                    />
                )
            }
        </UserConsumer>
    )
}

export default withError(WithUserContextProfile);

