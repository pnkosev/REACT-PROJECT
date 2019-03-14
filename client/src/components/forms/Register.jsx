import React from 'react';
import Input from '../common/Input';
import withForm from '../hocs/WithForm';
import withError from '../hocs/WithError';
import userRegisterModel from '../../helpers/models/userRegisterModel'

// class Register extends Component {
//     constructor(props) {
//         super(props);

//         this.state = {
//             username: '',
//             email: '',
//             password: '',
//             repeat: '',
//             error: {}
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
//         const { username, email, password } = this.state;
//         const credentials = { username, email, password };

//         let validationResult = validateForm(this.state);

//         if (!validationResult.success) {
//             notify('error', validationResult.message, validationResult.errors);
//             return;
//         }
        
//         const res = await Register.service.postRegister(credentials);

//         if (!res.success) {
//             this.setState({ error: res.errors });
//             notify('error', this.state.error);
//             return;
//         } else {
//             notify('success', res.message);
//         }

//         this.props.history.push('/');
//     }

//     render() {
//         return (
//             <div className="container">
//                 <h1>Register</h1>
//                 <form onSubmit={this.onSubmitHandler}>
//                     <Input
//                         name="username"
//                         value={this.state.username}
//                         onChange={this.onChangeHandler}
//                         label="Username"
//                     />
//                     <Input
//                         name="email"
//                         value={this.state.email}
//                         onChange={this.onChangeHandler}
//                         label="E-mail"
//                     />
//                     <Input
//                         name="password"
//                         type="password"
//                         value={this.state.password}
//                         onChange={this.onChangeHandler}
//                         label="Password"
//                     />
//                     <Input
//                         name="repeat"
//                         type="password"
//                         value={this.state.repeat}
//                         onChange={this.onChangeHandler}
//                         label="Repeat password"
//                     />
//                     <br/>
//                     <input type="submit" className="btn btn-primary" value="Register" />
//                 </form>
//             </div>
//         );
//     }
// }

const RegisterBase = (props) => {
    return (
        <div className="container">
            <h1>Register</h1>
            <form onSubmit={props.handleFormSubmit}>
                <Input
                    inputType={true}
                    name="username"
                    value={props.username}
                    onChange={props.handleChange}
                    label="Username"
                />
                <Input
                    inputType={true}
                    name="email"
                    value={props.email}
                    onChange={props.handleChange}
                    label="E-mail"
                />
                <Input
                    inputType={true}
                    name="password"
                    type="password"
                    value={props.password}
                    onChange={props.handleChange}
                    label="Password"
                />
                <Input
                    inputType={true}
                    name="repeat"
                    type="password"
                    value={props.repeat}
                    onChange={props.handleChange}
                    label="Repeat password"
                />
                <br/>
                <input type="submit" className="btn btn-primary" value="Register" />
            </form>
        </div>
    );
}

const WithFormRegister = withError(withForm(RegisterBase, userRegisterModel));
export default WithFormRegister;