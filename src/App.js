
import { createContext, useState } from "react";
import axios from "axios";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Game1 from './games/Game1';
import Game2 from './games/Game2';
import Game3 from './games/Game3';
import Game4 from "./games/Game4";
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute'; // ✅ import this

export const LoginContext = createContext();

function App() {
  const [user, setUser] = useState(true);

  const handleClick = async (e) => {
    e.preventDefault();
    console.log("Handleclick function is clicked");

    const res = await axios.get("http://localhost:2089/users");
    console.log(res);
    console.log(res.data.users);
  };

  return (
    <div className="App">
      <LoginContext.Provider value={{ user, setUser }}>
        <Router>
          <Header />

          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />

            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute><Home /></ProtectedRoute>
            } />
            <Route path="/game1" element={
              <ProtectedRoute><Game1 /></ProtectedRoute>
            } />
            <Route path="/game2" element={
              <ProtectedRoute><Game2 /></ProtectedRoute>
            } />
            <Route path="/game3" element={
              <ProtectedRoute><Game3 /></ProtectedRoute>
            } />
            <Route path="/game4" element={
              <ProtectedRoute><Game4 /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><Profile /></ProtectedRoute>
            } />
          </Routes>

          <Footer />
        </Router>
      </LoginContext.Provider>
    </div>
  );
}

export default App;
