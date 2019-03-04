import React from 'react';
import Input from '../common/Input';
import withForm from '../hocs/WithForm';

// class Login extends Component {
//     constructor(props) {
//         super(props);

//         this.state = {
//             username: '',
//             password: '',
//             error: {},
//         };

//         this.onChangeHandler = this.onChangeHandler.bind(this);
//         this.onSubmitHandler = this.onSubmitHandler.bind(this);
//     }

//     //static service = new AuthService();

//     onChangeHandler({ target }) {
//         this.setState({ [target.name]: target.value });
//     }

//     async onSubmitHandler(e) {
//         e.preventDefault();
//         const { username, password } = this.state;

//         let validationResult = validateForm(this.state);

//         if (!validationResult.success) {
//             notify('error', validationResult.message, validationResult.errors);
//             return;
//         }
        
//         const res = await Login.service.postLogin({username, password});

//         if (!res.success) {
//             this.setState({ error: res.message });
//             notify('error', this.state.error);
//             return;
//         } else {
//             localStorage.setItem('authToken', res.token);
//             localStorage.setItem('username', res.username);
//             localStorage.setItem('userId', res.userId);
//             localStorage.setItem('isAdmin', res.isAdmin);

//             notify('success', res.message);
//             this.props.history.push('/');
//         }
        
//     }

//     render() {
//         return (
//             <div className="container">
//                 <h1>Login</h1>
//                 <form onSubmit={this.onSubmitHandler}>
//                     <Input
//                         name="username"
//                         value={this.state.username}
//                         onChange={this.onChangeHandler}
//                         label="Username"
//                     />
//                     <Input
//                         name="password"
//                         type="password"
//                         value={this.state.password}
//                         onChange={this.onChangeHandler}
//                         label="Password"
//                     />
//                     <br/>
//                     <input type="submit" className="btn btn-primary" value="Login" />
//                 </form>
//             </div>
//         );
//     }
// }

const LoginBase = (props) => {
    return (
        <div className="container">
            <h1>Login</h1>
            <form onSubmit={props.handleFormSubmit}>
                <Input
                    name="username"
                    value={props.username}
                    onChange={props.handleChange}
                    label="Username"
                />
                <Input
                    name="password"
                    type="password"
                    value={props.password}
                    onChange={props.handleChange}
                    label="Password"
                />
                <br/>
                <input type="submit" className="btn btn-primary" value="Login" />
            </form>
        </div>
    );
}

const WithFormLogin = withForm(LoginBase);
export default WithFormLogin;