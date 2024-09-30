import axios from "axios";
import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "./register.scss";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const [proceedToRegister, setProceedToRegister] = useState(false); // New state to control form stage
  const history = useHistory();

  // This function will handle setting the email and proceeding to the next step
  const handleStart = (e) => {
    e.preventDefault();
    if (email) {
      setProceedToRegister(true); // Switch to showing the username/password form
    } else {
      setError("Please enter a valid email.");
    }
  };

  // Handle form submission and registration logic
  const handleFinish = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Change the URL if your backend is hosted elsewhere
      await axios.post("https://movie-app-a4bl.onrender.com/api/auth/register", { email, username, password });
      history.push("/login");
    } catch (err) {
      console.error(err);
      setError("Failed to register. Please try again.");
    }
  };

  return (
    <div className="register">
      <div className="top">
        <div className="wrapper">
          <img
            className="logo"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png"
            alt="Netflix Logo"
          />
          <Link to="/login">Sign In</Link>
        </div>
      </div>
      <div className="container">
        <h1>Unlimited movies, TV shows, and more.</h1>
        <h2>Watch anywhere. Cancel anytime.</h2>
        <p>Ready to watch? Enter your email to create or restart your membership.</p>

        {/* First step: Input for email */}
        {!proceedToRegister ? (
          <div className="input">
            <input
              type="email"
              placeholder="Email address"
              value={email} // Bind value to state
              onChange={(e) => setEmail(e.target.value)} // Capture input value
            />
            <button className="registerButton" onClick={handleStart}>
              Get Started
            </button>
          </div>
        ) : (
          // Second step: Input for username and password
          <form className="input" onSubmit={handleFinish}>
            <input
              type="text"
              placeholder="Username"
              value={username} // Bind value to state
              onChange={(e) => setUsername(e.target.value)} // Capture input value
            />
            <input
              type="password"
              placeholder="Password"
              value={password} // Bind value to state
              onChange={(e) => setPassword(e.target.value)} // Capture input value
            />
            <button className="registerButton" type="submit">
              Start
            </button>
          </form>
        )}

        {/* Display any error */}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}
