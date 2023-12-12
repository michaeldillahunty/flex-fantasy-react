import React, { useState } from "react";

import logoPlaceholder from '../images/logos/logo_notext_192x192.png';
import NavBar from "./NavBar";
import './styles/LoginPage.css';
import service from "../API/service";
const LoginPage = (props) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const handleGoogleLogin = () => {
    service.fetchGoogleUserData();
    handleLogin();
  }
  const handleLogin = () => {
      props.onLogin();
  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Add your login or registration logic here
    if (isRegistering) {
      var userData = await service.registerUser(formData.name,formData.username,formData.email,formData.password,formData.confirmPassword);
    } else {
      var userData = await service.loginUser(formData.email,formData.password);
      handleLogin();
    }
  };

  return (
    <div className="LoginPage">
    <header className="header">
      <div className="logo">
        <img src={logoPlaceholder} alt="Logo" />
        <h1 className="title">Flex Fantasy</h1>
      </div>
      <NavBar isLoggedIn = {props.isLoggedIn}/>
    </header>
    <div className="login-container">
        
      <h2 className="login-header">{isRegistering ? "Register" : "Login"}</h2>
      <form onSubmit={handleSubmit}>
        {isRegistering && (
          <div className="form-group">
            <label>Name</label>
            <input className="login-input"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter Name"
            />
          </div>
        )}
        <div className="form-group">
          <label>Email</label>
          <input className="login-input"
            type="text"
            name="email"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Enter Email"
          />
        </div>
        {isRegistering && (
          <div className="form-group">
            <label>Email</label>
            <input className="login-input"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter Email"
            />
          </div>
        )}
        <div className="form-group">
          <label>Password</label>
          <input className="login-input"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter Password"
          />
        </div>
        {isRegistering && (
          <div className="form-group">
            <label>Confirm Password</label>
            <input className="login-input"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm Password"
            />
          </div>
        )}
        <button className="login-button" type="submit">{isRegistering ? "Register" : "Login"}</button>
      </form>
      <button className="google-login" onClick={handleGoogleLogin}>Login with Google</button>

      <p className="login-text">
        {isRegistering
          ? "Already have an account? "
          : "Don't have an account? "}
        <span
          className="toggle-link"
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering ? "Login" : "Register"}
        </span>
      </p>
    </div>
    </div>
  );
};

export default LoginPage;
