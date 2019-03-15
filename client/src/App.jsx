import React, { Component, Fragment } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import toastr from 'toastr';

import './styles/typography.css'

import AdminRoute from './components/hocs/AdminRoute';
import PrivateRoute from './components/hocs/PrivateRoute';

import Home from './components/views/Home/Home';
import HeaderWithUserContext from './components/common/Header';
import Footer from './components/common/Footer';
import PostDetailsWithUserContext from './components/views/Post/PostDetailsPage';
import Profile from './components/views/User/Profile';
import NotFound from './components/views/Issue/NotFound';

import { postRegister, postLogin } from './services/auth';

import notify from './helpers/data/notifier';

import validateRegisterForm from './helpers/formValidators/registerFormValidator'
import validateLoginForm from './helpers/formValidators/loginFormValidator';
import validateCreatePostForm from './helpers/formValidators/createPostValidator';

import WithFormRegister from './components/forms/Register';
import LoginWithContext from './components/forms/Login';
import WithFormCreatePost from './components/forms/CreatePost';
import EditPost from './components/views/Post/EditPost';
import EditComment from './components/views/Comment/EditComment';
import PendingWithUserContext from './components/views/User/Pending';

import { UserProvider, defaultUserState } from './components/contexts/UserContext';
import PostService from './services/post';

toastr.options.newestOnTop = false;
toastr.options.closeButton = true;

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			user: {
				...defaultUserState
			}
		};

		this.onLogout = this.onLogout.bind(this);
	}

	static postService = new PostService();

	updateUser = (user) => {
		this.setState({
			user
		});
	}

	onLogout(e) {
		e.preventDefault();
		localStorage.clear();
		notify('success', 'You have successfully logged out!');
		this.updateUser({
			user: { ...defaultUserState }
		})
		this.props.history.push('/');
	}

	componentDidMount() {
		const isLoggedIn = localStorage.getItem('authToken') !== null;
		const username = localStorage.getItem('username');
		const isAdmin = localStorage.getItem('isAdmin') === 'true';
		let user = {
			isLoggedIn,
			username,
			isAdmin
		};
		this.updateUser(user);
	}

	render() {
		const { user } = this.state;

		return (
			<Fragment>
				<UserProvider value={user} >
					<HeaderWithUserContext
						isLoggedIn={user.isLoggedIn}
						username={user.username}
						isAdmin={user.isAdmin}
						onLogout={this.onLogout}
					/>
					<Switch>
						<Route path="/" exact component={Home} />
						<Route path="/user/register" exact render={(props) =>
							<WithFormRegister
								request={postRegister}
								validateForm={validateRegisterForm}
								updateUser={this.updateUser}
								{...props}
							/>
						} />
						<Route path="/user/login" exact render={(props) =>
							<LoginWithContext
								request={postLogin}
								validateForm={validateLoginForm}
								updateUser={this.updateUser}
								{...props}
							/>
						} />
						<PrivateRoute path="/user/profile" exact render={(props) =>
							<Profile
								{...props}
							/>
						} />
						<AdminRoute path="/user/admin/work" exact render={(props) =>
							<PendingWithUserContext {...props} />
						} />
						<PrivateRoute path="/post/create" exact render={(props) =>
							<WithFormCreatePost
								request={App.postService.postCreate}
								validateForm={validateCreatePostForm}
								{...props}
							/>
						} />
						<Route path="/post/:postId" exact render={(props) =>
							<PostDetailsWithUserContext
								{...props}
							/>
						} />
						<PrivateRoute path="/post/update/:postId" exact render={(props) =>
							<EditPost
								validateForm={validateCreatePostForm}
								{...props}
							/>
						} />
						<Route path="/comment/update/:commentId" exact render={(props) =>
							<EditComment
								{...props}
							/>
						} />
						<Route component={NotFound} />
					</Switch>
					<Footer />
				</UserProvider>
			</Fragment>
		);
	}
}

export default withRouter(App);
