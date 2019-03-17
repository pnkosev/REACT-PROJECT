import React, { Component } from 'react';
import PostService from '../../../services/post';
import ServerNotResponding from '../Issue/SeverNotResponding';
import withError from '../../hocs/WithError';
import Post from '../Post/Post';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            hasNext: true,
            hasFetched: false,
            hasServerIssue: false,
        }
    }

    static postServices = new PostService();

    componentDidMount() {
        Home.postServices
            .getAll()
            .then((data) => {
                this.setState({
                    posts: data.posts,
                    hasFetched: true,
                })
            })
            .catch((err) => {
                this.setState({ hasServerIssue: true })
                console.log(err);
            })
    }

    render() {
        const { posts, hasFetched, hasServerIssue } = this.state;
        if (hasServerIssue) {
            return <ServerNotResponding />;
        }
        return (
            <div>
                <h1>This is the home page</h1>
                <div>Some Home Stuff, Homie ;)</div>
                {
                    !hasFetched
                    ? (<h2>Loading...</h2>)
                    : (<div>Posts:</div>)
                }
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
                    : <h2>Currently no posts...</h2>
                }
                </div>
            </div>
        )
    }
}

export default withError(Home);