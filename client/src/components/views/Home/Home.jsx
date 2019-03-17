import React, { Component } from 'react';
import PostService from '../../../services/post';
import ServerNotResponding from '../Issue/SeverNotResponding';
import withError from '../../hocs/WithError';
import Post from '../Post/Post';
import ErrorBoundary from '../../hocs/ErrorBoundary';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            hasLast: 0,
            hasNext: true,
            hasFetched: false,
            hasServerIssue: false,
        }

        this.getData = this.getData.bind(this);
    }

    static postServices = new PostService();

    async getData() {
        try {
            let data = await Home.postServices.getAll();
            if (!data.success) {
                throw new Error(data.message);
            } else {
                let hasNext = data.posts < 9 ? false : true;
                this.setState({
                    posts: data.posts,
                    hasFetched: true,
                    hasNext
                });
            }
        } catch (err) {
            console.log(err);
            this.setState({ hasServerIssue: true })
        }

    }

    componentDidMount() {
        this.getData();
    }

    render() {
        const { posts, hasFetched, hasLast, hasNext, hasServerIssue } = this.state;

        if (hasServerIssue) {
            return <ServerNotResponding />;
        }

        return (
            <div>
                <h1>This is the home page</h1>
                <div>Some Home Stuff, Homie ;)</div>
                {
                    !hasFetched
                        ? (
                            <h2>Loading...</h2>
                        ) : (
                            <ErrorBoundary>
                                <div>Posts:</div>
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
                                {
                                    hasLast === true && (
                                        <button className="last-btn" onClick={this.getData}>Next</button>
                                    )
                                }
                                {
                                    hasNext === true && (
                                        <button className="nxt-btn" onClick={this.getData}>Next</button>
                                    )
                                }
                            </ErrorBoundary>
                        )
                }
            </div>
        )
    }
}

export default withError(Home);