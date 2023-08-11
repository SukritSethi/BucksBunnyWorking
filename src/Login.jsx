import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from "./AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signIn } = UserAuth();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signIn(email, password);
      navigate("/main");
    } catch (e) {
      setError(e.message);
      console.log(e.message);
    }
  };

  return (
    <div className="back">
      <div className="heading">BucksBunny</div>
      
        <div className="heading">Login</div>
      
      <form className="form" onSubmit={handleSignIn}>
        <div className="email">
          <input
            placeholder="Enter your email..."
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />
        </div>
        <div className="pass">
          <input
            placeholder="Enter your password..."
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="butt" type="submit">
          Login
        </button>
      </form>
      <div className="link__login">Don't have an account? <Link to="/">Signup</Link></div>
    </div>
  );
}

export default Login;
