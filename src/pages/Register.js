import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Register.css";
import bg from "../assets/login-bg.png"; // ✅ Use the same background as login

const Register = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 6 characters, include a number, a lowercase and an uppercase letter."
      );
      return;
    }

    try {
      await axios.post("http://localhost:2089/auth/signup", { email, password });
      alert(`Account created for ${email}`);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div
      className="register-page"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form className="register-form" onSubmit={handleSignup}>
        <h2>🎮 Create Your Gamer Account</h2>

        {error && <div className="register-error">{error}</div>}

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
        <p style={{ fontSize: "12px", color: "#ccc", marginTop: "-10px", marginBottom: "5px" }}>
          Password must be at least 6 characters, include a number, a lowercase and an uppercase letter.
        </p>

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit">Sign Up</button>

        <p className="redirect-login">
          Already have an account?{" "}
          <Link to="/login" className="redirect-link">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
