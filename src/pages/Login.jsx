import "./Login.css";
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import { toast } from "react-toastify";
export default function Login() {
    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true);
    const formModel={
        email:"",
        password:""
    }

    const [type,setType] = useState("password")

    const [loginInput,setLoginInput] = useState(formModel)

    const handleInput = (e) =>{
        const input = e.target
        const name = input.name
        const value = input.value
        setLoginInput({
            ...loginInput,
            [name] : value
        })
    }

    const loginForm = async(e)=>{
        try{
            e.preventDefault()
            // const user = {
            //     email:"",
            //     password:""
            // }
          console.log(loginInput)
            const {data} = await axiosInstance.post("/user/login",loginInput)
            console.log(data)
            toast(data.message,{position:"top-center",type:"success"})
            if(data.role === "admin")
                return window.location = "/admin/dashboard"
        
             return window.location = "/msme-gis-map"

        }
        catch(err){
            toast.error(err.response ? err.response.data.message : err.message,
                {position:"top-center"}
            )
        }
    }






    return (
        <>
    
            <div className="page-wrapper">
                {/* <header className="transparent-header">
                    <div className="header-container">
                      
                        <div className="left-logo">
                            <img src="/har_govt.png" alt="logo" />
                        </div>


                       
                        <div className="header-title">
                            <h1>MSME GIS-Based Land & Investment</h1>
                        </div>

                      
                        <div className="right-logo">
                            <img src="/hepc-logo.png" alt="logo" />
                        </div>
                    </div>
                </header> */}

                {/* Aapka baaki content yahan aayega */}
                <div className="hero-container">
                    <div className="hero-content">

                        {/* Left Side: Text and Features */}
                        <div className="left-section">
                            <h1 className="hero-title">
                                Unlock Business Growth <br /> with GIS Insights!
                            </h1>
                            <p className="hero-description">
                                Utilize GIS technology to find the most suitable land with optimal
                                connectivity, infrastructure and resources for your investment
                                and business expansion.
                            </p>

                            <div className="features-list">
                                <div className="feature-item">
                                    <span className="check-badge">✓</span>
                                    <span>Analyze land and investment opportunities</span>
                                </div>
                                <div className="feature-item">
                                    <span className="check-badge">✓</span>
                                    <span>Identify prime industrial zones</span>
                                </div>
                                <div className="feature-item">
                                    <span className="check-badge">✓</span>
                                    <span>Make informed site selection decisions</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Login Card */}
                        <div className="right-section">
                            <div className="login-card">
                                {/* <div className="card-header"> */}
                                    <div className="left-logo">
                                        <img src="/har_govt.png" alt="logo" />
                                    </div>

                                    <h2>Login to Your Account</h2>


                                {/* </div> */}
                                <form className="login-form"  onSubmit={loginForm}>
                                    <div className="input-field">
                                        {/* <i className="fa-solid fa-user"></i> */}
                                        <input 
                                        type="email" 
                                        name="email"
                                        onChange={handleInput}
                                        placeholder="Email" 
                                        required />
                                    </div>

                                    <div className="input-field">
                                        {/* <i className="fa-solid fa-lock"></i> */}
                                        <input 
                                        type={type}
                                        name="password"
                                        onChange={handleInput}
                                         placeholder="Password"
                                         required />
                                   
                                    </div>

                                    <div className="form-options">
                                        <label className="checkbox-container">
                                            <input type="checkbox" />
                                            <span className="checkmark"></span>
                                            Remember me
                                        </label>
                                    </div>

                                    <button type="submit" className="login-button">Login</button>

                                    <a href="/" className="forgot-link">Forgot password?</a>

                                    <p className="signup-text">
                                        Don't have an account?
                                        <span
                                            style={{ cursor: 'pointer', color: '#4ade80', fontWeight: 'bold' }}
                                            onClick={() => navigate('/Signup')}
                                        >
                                            Sign Up
                                        </span>
                                    </p>
                                </form>


                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </>



    );
};

