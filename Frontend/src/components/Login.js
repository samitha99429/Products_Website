import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/styles/login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      console.log(response.data.token);
      window.location.reload('/homepage');
    } catch (err) {
      alert('Invalid email or password');
      setError('Invalid email or password');
    }
  };

  return (

<>
      <div class="container d-flex justify-content-center align-items-center min-vh-100">
    <div class="loginCard p-5 shadow">
        <div class="text-center mb-4">
            <h2 class="logoText">CODE94</h2>

        </div>
        <h3 class="text-center mb-4">Sign in</h3>
        <form onSubmit={handleSubmit}>
            <div class="mb-3">
                <label for="email" class="form-label">Email address</label>
                <input class="form-control"
            type="email"
            value={email}
            placeholder='@gmail.com'
            onChange={(e) => setEmail(e.target.value)}
            required
          />
                
            </div>
            <div class="mb-2">
                <label for="password" class="form-label">Password</label>
                <input type="password" 
                value={password} 
                onChange={(e)=> setPassword(e.target.value)}  
                class="form-control " 
                id="password" placeholder="********"/>
    
            </div>
            <div class="d-grid">
                <button type="submit" class="btn btn-primary btn-block">SIGN IN</button>
            </div>
         
        </form>
        <div class="text-center mt-4">
            <p>Don't have an account? <a href="/register">Create an account</a></p>
        </div>
    </div>
</div>
</>
     

  );
};

export default Login;
