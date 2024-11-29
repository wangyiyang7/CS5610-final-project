import React, { useState, useContext } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const LoginComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://cs5610-final-project-server.vercel.app/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email, password: password }),
        }
      );
      const data = await response.json();

      const from = // access the pathname property of the from object within state
        location.state?.from?.pathname || `/profile/${data.accountId}`;

      if (response.ok) {
        login(data.tkn, data.accountId);
        navigate(from);
      } else {
        setMessage("Your password is incorrect. Please try again");
      }
    } catch (error) {
      console.error(error);
      setMessage("Your password is incorrect. Please try again");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Sign In</h1>
        <form action="/login" method="post">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="buttons">
            <Link to="/login">
              <button type="submit" onClick={handleLogin}>
                Sign In
              </button>
            </Link>
            <Link to="/register">
              <button type="button">Create Account</button>
            </Link>
          </div>
          {message && <p style={{ color: "red" }}>{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginComponent;
