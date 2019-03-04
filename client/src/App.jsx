import React, { Component, Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import toastr from 'toastr';

import Home from './components/views/Home';
import NotFound from './components/views/NotFound';
import Header from './components/common/Header';
import Footer from './components/common/Footer';

import { postRegister, postLogin } from './services/auth';
import validateRegisterForm from './helpers/validators/registerFormValidator'
import validateLoginForm from './helpers/validators/loginFormValidator';
import WithFormLogin from './components/forms/Login';
import WithFormRegister from './components/forms/Register';

toastr.options.newestOnTop = false;
toastr.options.closeButton = true;

class App extends Component {
	constructor(props) {
        super(props);

        this.state = {
			isLoggedIn: false,
        };
    }

	render() {
		return (
			<Fragment>
				<Header />
				<Switch>
					<Route path="/" exact component={Home} />
					<Route path="/user/register" exact render={(props) => 
						<WithFormRegister
							postRequest={postRegister}
							validateForm={validateRegisterForm}
							{...props}
						/>
					} />
					<Route path="/user/login" exact render={(props) => 
						<WithFormLogin
							postRequest={postLogin}
							validateForm={validateLoginForm}
							{...props}
						/>
					} />
					<Route component={NotFound} />
				</Switch>
				<Footer />
			</Fragment>
		);
	}
}

export default App;
