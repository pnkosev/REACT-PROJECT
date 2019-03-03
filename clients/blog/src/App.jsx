import React, { Component, Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from './components/views/Home';
import NotFound from './components/views/NotFound';
import Register from './components/forms/Register';
import Login from './components/forms/Login';
import Header from './components/common/Header';

class App extends Component {
	render() {
		return (
			<Fragment>
				<Header />
				<Switch>
					<Route path="/" exact component={Home} />
					<Route path="/user/register" exact component={Register} />
					<Route path="/user/login" exact component={Login} />
					<Route component={NotFound} />
				</Switch>
			</Fragment>
		);
	}
}

export default App;
