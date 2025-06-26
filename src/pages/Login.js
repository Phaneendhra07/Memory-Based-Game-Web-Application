import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoginContext } from '../App';
import axios from 'axios';
import '../styles/Login.css';
import bg from '../assets/login-bg.png'; // Make sure the background is here

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(LoginContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      await axios.post('http://localhost:2089/auth/signin', { email, password });
      setUser({ email });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Try again.');
    }
  };

  return (
    <div
      className="login-fullscreen"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>

        {error && <div className="login-error">{error}</div>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>

        <p>
          Don't have an account?{' '}
          <Link to="/register" className="login-link">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;