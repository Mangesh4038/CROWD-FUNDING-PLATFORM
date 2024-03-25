import React, { useState, useEffect, useContext } from 'react';
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import UserContext from '../../Context/userContext';
import axios from '../../Axios/axios';
import Navbar from '../Landing Pages/Navbar';
import Cookies from 'js-cookie'; // Import js-cookie library

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "", role: "startup" }); // Default role is startup
  const navigate = useNavigate();
  const context = useContext(UserContext);
  let { showAlert } = context;
  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate("/dashboard");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:5000/api/auth/login`, {
        email: credentials.email,
        password: credentials.password,
        role: credentials.role // Pass role to the server
      });
  
      console.log('Login response:', response.data); // Log the response data
  
      if (response.data.success) {
        // Save the token and redirect
        localStorage.setItem("token", response.data.token);
        showAlert("Logged In Successfully!!!", "success");
  
        // Set the cookie
        Cookies.set('token', response.data.token, { expires: 7, path: '/' });
  
        navigate("/dashboard");
      } else {
        console.error('Login failed:', response.data); // Log the response data when login fails
        showAlert("Invalid Credentials, please check", "danger");
      }
    } catch (error) {
      console.error("Login error:", error);
      showAlert("An error occurred during login. Please try again later.", "danger");
    }
    setCredentials({ email: "", password: "", role: "startup" }); // Reset role to startup after submission
  };
  
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Navbar />
      <div className="card mx-auto login__card">
        <form onSubmit={handleSubmit}>
          <div className="row g-0">
            <div className="col-lg-6 col-sm-12">
              <img src="https://bootstrapious.com/i/snippets/sn-registeration/illustration.svg" className="img-fluid rounded-start login__image" alt="login" />
            </div>
            <div className="col-lg-6 col-sm-12">
              <div className="card-body">
                <div className="login__head">Welcome Back!</div>
                <div className="login__para">Login to continue</div>
                <div className="row">
                  <div className="col-md-12 col-sm-12">
                    <i className="fa-solid fa-user email__icon"></i>
                    <input type="email"
                      className="input__email"
                      placeholder="Enter Email"
                      id="email"
                      name="email"
                      value={credentials.email}
                      onChange={onChange} />
                  </div>
                  <div className="col-md-12 col-sm-12">
                    <i className="fa-solid fa-lock password__icon"></i>
                    <input type="password"
                      className="input__password"
                      placeholder="Enter Password"
                      id="password"
                      name="password"
                      value={credentials.password}
                      onChange={onChange} />
                  </div>
                  <div className="col-md-12 col-sm-12">
                    <label htmlFor="role">Select Role:</label>
                    <select name="role" id="role" value={credentials.role} onChange={onChange}>
                      <option value="startup">Startup</option>
                      <option value="investor">Investor</option>
                    </select>
                  </div>
                  <div className="col-md-12 col-sm-12 login__btn">
                    <input type="submit" className="login__button" value="Login" />
                  </div>
                  <div className="col-md-12 col-sm-12 go__signup">
                    <p className="text-center">Not a Member?<Link to="/signup">SignUp</Link></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

export default Login;
