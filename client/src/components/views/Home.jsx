import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PostService from '../../services/post';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            hasFetched: false,
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
                console.log(err);
            })
    }

    render() {
        const { posts, hasFetched } = this.state;
        return (
            <div>
                <h1>This is the home page</h1>
                <div>Some Home Stuff, Homie ;)</div>
                {
                    !hasFetched
                    ? (<h2>Loading...</h2>)
                    : (<div>Posts:</div>)
                }
                {
                    posts
                    ? posts.map(p => (
                        <article key={p._id}>
                            <h2>{p.title}</h2>
                            <div>{p.content}</div>
                            <button>
                                <Link to={"/post/" + p._id}>Details</Link>
                            </button>
                        </article>))
                    : <h2>Currently no posts...</h2>
                }
            </div>
        )
    }
}

export default Home;