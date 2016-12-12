import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import validator from 'validator';
import * as userActions from '../../actions/user-actions';
import play from '../../../play.png';
import { connect } from 'react-redux';
import {Link} from 'react-router';
import Feedback from '../Feedback';


class Login extends Component {
    
   onSubmit(event) {
        event.preventDefault();
        let emailText = ReactDOM.findDOMNode(this.refs.emailText).value;
        let passwordText = ReactDOM.findDOMNode(this.refs.passwordText).value;
        if(!validator.isEmail(emailText) || emailText.length <= 6) {
            console.log('Invalid email.')
            return ;
        }
        if(passwordText.length <= 5) {
            console.log('password too short.')
            return this.refs.passwordText.value = "";
        }
        this.refs.emailText.value = "";
        this.refs.passwordText.value = "";
        return this.props.dispatch(userActions.loginRequest(emailText, passwordText));   
    }
    
    render() {
        return (
            <div className="Login-page">
            
            <span className="title">Sync-In</span>
                <form className="login-container" onSubmit={this.onSubmit.bind(this)}>
                    <label className="username">Email:</label>

                    <input type="email" id="username" className="input" ref="emailText" required />
                    
                    <label className="password">Password:</label>

                    <input type="password" className="input" name="password" ref="passwordText" required />

                    <button id="login-button" value="Submit" type="submit" className="login-button">Submit</button>
                    <Link to="/register" id="registerlink"> Dont have an account? Let's hook you up, man. </Link>
                    <a id="google-login" href="https://asyncin.herokuapp.com/auth/google" className="google-login">Log in with Google</a><br />
                    <a id="facebook-login" href="https://asyncin.herokuapp.com/auth/facebook" className="facebook-login">Log in with Facebook</a>
                </form>

            </div>
        );
    }
    
};

export default connect()(Login);


