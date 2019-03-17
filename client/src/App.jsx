import React, { Component, Fragment } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import toastr from 'toastr';

import './styles/typography.css'

import AdminRouteWithUserContext from './components/hocs/AdminRoute';
import PrivateRouteWithUserContext from './components/hocs/PrivateRoute';

import Home from './components/views/Home/Home';
import HeaderWithUserContext from './components/common/Header';
import Footer from './components/common/Footer';
import PostDetailsWithUserContext from './components/views/Post/PostDetailsPage';
import WithUserContextProfile from './components/views/User/Profile';
import NotFound from './components/views/Issue/NotFound';

import { postRegister, postLogin } from './services/auth';
import PostService from './services/post';

import notify from './helpers/data/notifier';

import validateRegisterForm from './helpers/formValidators/registerFormValidator'
import validateLoginForm from './helpers/formValidators/loginFormValidator';
import validateCreatePostForm from './helpers/formValidators/createPostValidator';

import { UserProvider, defaultUserState } from './components/contexts/UserContext';
import WithFormRegister from './components/forms/Register';
import WithFormLogin from './components/forms/Login';
import WithFormCreatePost from './components/forms/CreatePost';
import EditPostWithContext from './components/views/Post/EditPost';
import EditCommentWithContext from './components/views/Comment/EditComment';
import PendingWithUserContext from './components/views/User/Pending';

toastr.options.newestOnTop = false;
toastr.options.closeButton = true;

class App extends Component {
	constructor(props) {
		super(props);
		const hasUser = localStorage.getItem('user');
		const parsedUser = hasUser ? JSON.parse(hasUser) : {};

		this.state = {
			user: {
				...defaultUserState,
				...parsedUser,
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
							<WithFormLogin
								request={postLogin}
								validateForm={validateLoginForm}
								updateUser={this.updateUser}
								{...props}
							/>
						} />
						<PrivateRouteWithUserContext path="/user/profile" exact render={(props) =>
							<WithUserContextProfile
								{...props}
							/>
						} />
						<AdminRouteWithUserContext path="/user/admin/work" exact render={(props) =>
							<PendingWithUserContext {...props} />
						} />
						<PrivateRouteWithUserContext path="/post/create" exact render={(props) =>
							<WithFormCreatePost
								request={(p) => App.postService.postCreate(p)}
								validateForm={validateCreatePostForm}
								{...props}
							/>
						} />
						<Route path="/post/details/:postId" exact render={(props) =>
							<PostDetailsWithUserContext
								{...props}
							/>
						} />
						<PrivateRouteWithUserContext path="/post/update/:postId" exact render={(props) =>
							<EditPostWithContext
								{...props}
							/>
						} />
						<AdminRouteWithUserContext path="/comment/update/:commentId" exact render={(props) =>
							<EditCommentWithContext
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
