import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LoginContext } from '../App';
import '../styles/Header.css';
import logo from '../assets/spn-logo2.png';

const Header = () => {
  const { user, setUser } = useContext(LoginContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(false);
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="SPN Games Logo" />
      </div>
      <nav className="nav">
        <ul className="nav-list">
          {user ? (
            <>
              <li><NavLink to="/" className="nav-link">Home</NavLink></li>
              <li><NavLink to="/about" className="nav-link">About</NavLink></li>
              <li><NavLink to="/profile" className="nav-link">Profile</NavLink></li>
              <li>
                <button onClick={handleLogout} className="logout-button">Logout</button>
              </li>
            </>
          ) : (
            <>
              <li><NavLink to="/about" className="nav-link">About</NavLink></li>
              <li><NavLink to="/login" className="nav-link">Login</NavLink></li>
              <li><NavLink to="/register" className="nav-link">Register</NavLink></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;

