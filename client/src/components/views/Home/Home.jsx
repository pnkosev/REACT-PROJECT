import React, { Component, Fragment } from 'react';
import PostService from '../../../services/post';
import ServerNotResponding from '../Issue/SeverNotResponding';
import withError from '../../hocs/WithError';
import Post from '../../post/Post';
import ErrorBoundary from '../../hocs/ErrorBoundary';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            page: 1,
            hasLast: false,
            hasNext: false,
            hasFetched: false,
            hasServerIssue: false,
        }
    }

    static postServices = new PostService();

    setPage = (step) => {
        this.setState((prevState) => ({
            page: prevState.page + step,
        }));
    };

    async getData(page) {
        try {
            let data = await Home.postServices.getAll(page);
            if (!data.success) {
                throw new Error(data.message);
            } else {
                let hasNext = data.posts.length === 6;
                let hasLast = this.state.page > 1;
                this.setState({
                    posts: data.posts,
                    hasFetched: true,
                    hasNext,
                    hasLast,
                });
            }
        } catch (err) {
            console.log(err);
            this.setState({ hasServerIssue: true })
        }

    }

    componentDidMount() {
        const { page } = this.state;
        this.getData(page);
    }

    componentDidUpdate(prevProps, prevState) {
        const { page: currentPage } = this.state;
        const { page: lastPage } = prevState;

        if (currentPage !== lastPage) {
            console.log('no infinite loop yo!');
            this.getData(currentPage);
        }
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
                                <div className="pagination-btns">
                                    {
                                        hasLast
                                        ? (
                                            <button className="last-btn" onClick={() => this.setPage(-1)}>Last Page</button>
                                        ) : (
                                            null
                                        )
                                    }
                                    {
                                        hasNext
                                        ? (
                                            <button className="nxt-btn" onClick={() => this.setPage(1)}>Next Page</button>
                                        ) : (
                                            null
                                        )
                                    }
                                </div>
                                {
                                    posts.length
                                        ? (
                                            <Fragment>
                                                <h2>Posts:</h2>
                                                <div className="cards-layout flex">
                                                    {posts.map(p => (
                                                    <Post key={p._id}
                                                        title={p.title}
                                                        content={p.content}
                                                        imageUrl={p.imageUrl}
                                                        id={p._id}
                                                        author={p.creator.username}
                                                    />))}
                                                </div>
                                            </Fragment>
                                        ) : (
                                            <Fragment>
                                            {
                                                hasLast 
                                                ? (
                                                    <h3>THE END :)</h3>
                                                ) : (
                                                    <h3>Currently no posts...</h3>
                                                )
                                            }
                                            </Fragment>
                                        )
                                }
                                {
                                    posts.length
                                    ? (
                                        <div className="pagination-btns">
                                            {
                                                hasLast
                                                ? (
                                                    <button className="last-btn" onClick={() => this.setPage(-1)}>Last Page</button>
                                                ) : (
                                                    null
                                                )
                                            }
                                            {
                                                hasNext
                                                ? (
                                                    <button className="nxt-btn" onClick={() => this.setPage(1)}>Next Page</button>
                                                ) : (
                                                    null
                                                )
                                            }
                                        </div>
                                    ) : (
                                        null
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