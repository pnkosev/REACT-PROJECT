import React, { Component, Fragment } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import toastr from 'toastr';

import './styles/typography.css'

import PrivateRoute from './components/common/PrivateRoute';
import Home from './components/views/Home';
import NotFound from './components/views/NotFound';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import PostDetails from './components/views/PostDetails';

import { postRegister, postLogin } from './services/auth';
import PostService from './services/post';

import validateRegisterForm from './helpers/formValidators/registerFormValidator'
import validateLoginForm from './helpers/formValidators/loginFormValidator';
import validateCreatePostForm from './helpers/formValidators/createPostValidator';
import WithFormRegister from './components/forms/Register';
import WithFormLogin from './components/forms/Login';
import WithFormCreatePost from './components/forms/CreatePost';
import EditPost from './components/forms/EditPost';
import CommentsPending from './components/views/CommentsPending';

toastr.options.newestOnTop = false;
toastr.options.closeButton = true;

class App extends Component {
	constructor(props) {
        super(props);

        // this.state = {
		// 	isLoggedIn: false,
		// 	username: '',
		// };
		
		this.onLogout = this.onLogout.bind(this);
	}

	static postService = new PostService();

	onLogout(e) {
		e.preventDefault();
		localStorage.clear();
		// this.setState({
		// 	isLoggedIn: false,
		// 	username: ''
		// })
		this.props.history.push('/');
	}
	
	// componentDidMount() {
	// 	const user = localStorage.getItem('authToken') !== null ? true : false;
	// 	const username = localStorage.getItem('username');
		
	// 	if (user) {
	// 		this.setState({
	// 			isLoggedIn: true,
	// 			username
	// 		})
	// 	}
	// }

	
	render() {
		return (
			<Fragment>
				<Header 
					isLoggedIn={localStorage.getItem('authToken') !== null} 
					username={localStorage.getItem('username')}
					isAdmin={(localStorage.getItem('isAdmin') === 'true')}
					onLogout={this.onLogout}
				/>
				<Switch>
					<Route path="/" exact component={Home} />
					<Route path="/user/register" exact render={(props) => 
						<WithFormRegister
							request={postRegister}
							validateForm={validateRegisterForm}
							{...props}
						/>
					} />
					<Route path="/user/login" exact render={(props) => 
						<WithFormLogin
							request={postLogin}
							validateForm={validateLoginForm}
							{...props}
						/>
					} />
					<PrivateRoute path="/post/create" exact render={(props) => 
						<WithFormCreatePost
							request={App.postService.postCreate}
							validateForm={validateCreatePostForm}
							{...props}
						/>
					} />
					<Route path="/post/:postId" exact render={(props) => 
						<PostDetails
							{...props}
						/>
					} />
					<PrivateRoute path="/post/update/:postId" exact render={(props) => 
						<EditPost
							validateForm={validateCreatePostForm}
							{...props}
						/>
					} />
					<PrivateRoute path="/comment/pending" exact render={(props) => 
						<CommentsPending {...props}/>
					} />
					<Route component={NotFound} />
				</Switch>
				<Footer />
			</Fragment>
		);
	}
}

export default withRouter(App);
