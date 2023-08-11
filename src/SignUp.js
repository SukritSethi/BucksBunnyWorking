import React, { useState } from 'react';
import './SignUp.css';
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from './AuthContext';

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const {createUser} = UserAuth();
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try{
      await createUser(email, password)
      navigate('/main')
    }catch (e) {
      setError(e.message);
      console.log(e.message);
    }
  };

  return (
    <div className='back'>
      <div className='heading'>BucksBunny</div>
      <div className='heading'>Sign Up</div>
      <form className='form' onSubmit={handleSubmit}>
        <div className='email'>
          <input
            placeholder='Enter your username...'
            type="text"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />
        </div>
        <div className='pass'>
          <input
            placeholder='Enter your password...'
            type="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
          />
        </div>
        <button className="butt" type="submit">Sign Up</button>
      </form>
      <div className="link__login">Already have an account? <Link to="/login">Login</Link></div>
    </div>
  );
}

export default SignUp;