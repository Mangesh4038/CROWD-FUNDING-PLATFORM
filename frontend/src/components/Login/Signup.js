// Signup.js
import React, { useState, useEffect } from 'react';
import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";
import register from "../images/register.png";
import axios from 'axios';
import Navbar from '../Landing Pages/Navbar';

const Signup = () => {
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false); // New state variable for success
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(''); // Clear any previous error
    setSuccess(false); // Reset success state
    
    try {
      const response = await axios.post(`http://localhost:5000/api/auth/create-user`, {
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
      });
  
      console.log("Response data:", response.data); // Log the response data
  
      // Now check the response data to see what's being returned
      if (response.data && response.data.success) {
        setSuccess(true); // Set success state to true
        navigate("/login");
      } else {
        setError(response.data.error || "Failed to create user. Please try again later.");
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError("Email address is already in use. Please use a different email.");
      } else {
        setError("Failed to create user. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  
    // Clear the form fields after submission
    setCredentials({ name: "", email: "", password: "", cpassword: "" });
  };
  
  
  

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('token');
    if (isLoggedIn) {
      navigate('/home');
    }
  }, []);

  return (
    <>
      <Navbar />
      <div className="card mx-auto register__card">
        <form onSubmit={handleSubmit}>
          <div className="row g-0">
            <div className="col-lg-6 col-sm-12">
              <img src={register} className="img-fluid rounded-start signup__image" alt="signup" />
            </div>
            <div className="col-lg-6 col-sm-12">
              <div className="card-body">
                <div className="register__head">Welcome!</div>
                <div className="register__para">Register to continue</div>
                <div className="row">
                  <div className="col-md-12 col-sm-12">
                    <i className="fa-solid fa-user email__icon"></i>
                    <input type="text"
                      className="input__email"
                      placeholder="Enter Username"
                      id="name"
                      name="name"
                      value={credentials.name}
                      onChange={handleChange}
                      required={true} />
                  </div>
                  <div className="col-md-12 col-sm-12">
                    <i className="fa-solid fa-user email__icon"></i>
                    <input type="email"
                      className="input__email"
                      placeholder="Enter Email"
                      id="email"
                      name="email"
                      value={credentials.email}
                      onChange={handleChange}
                      required={true} />
                  </div>
                  <div className="col-md-12 col-sm-12">
                    <i className="fa-solid fa-lock password__icon"></i>
                    <input type="password"
                      className="input__password"
                      placeholder="Enter Password"
                      id="password"
                      name="password"
                      value={credentials.password}
                      onChange={handleChange}
                      required={true}
                      minLength={6} />
                  </div>
                  <div className="col-md-12 col-sm-12">
                    <i className="fa-solid fa-lock password__icon"></i>
                    <input type="password"
                      className="input__password"
                      placeholder="Confirm Password"
                      id="cpassword"
                      name="cpassword"
                      value={credentials.cpassword}
                      onChange={handleChange}
                      required={true}
                      minLength={6} />
                  </div>
                  <div className="col-md-12 col-sm-12 register__btn">
                    <button type="submit"
                      className="register__button"
                      disabled={credentials.password !== credentials.cpassword || credentials.password.length < 6}>
                      Register
                    </button>
                  </div>
                  <div className="col-md-12 col-sm-12 go__signup">
                    <p className="text-center">Already a Member?<Link to="/login">Login</Link></p>
                  </div>
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">User created successfully! Please check your email for verification.</div>}
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

export default Signup;