import { useContext, useState } from "react";
import { login } from "../../authContext/apiCalls";
import { AuthContext } from "../../authContext/AuthContext";
import "./login.scss";
import {Link} from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const { dispatch } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading to true when login starts
    try {
      await login({ email, password }, dispatch);
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false); // Set loading to false when login completes
    }
  };

  return (
    <div className="login">
      <div className="top">
        <div className="wrapper">
          <img
            className="logo"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png"
            alt=""
          />
        </div>
      </div>
      <div className="container">
        <form>
          <h1>Sign In</h1>
          <input
            type="email"
            placeholder="Email or phone number"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* Conditional rendering of loader */}
          <button className="loginButton" onClick={handleLogin}>
            {isLoading ?<div className='spinng'><div class="loader"></div><span>Signin in</span></div>  : "Sign In"}
          </button>
          <span>
            New to Netflix? <Link to='/register' style={{textDecoration:'none',cursor:'pointer',color:'#fff'}} className='text-white cursor-pointer'>Sign up now.</Link>
          </span>
          <small>
          This project is a demonstration of my coding skills and is not affiliated with or endorsed by Netflix. For the official site please visit<a href='https://www.netflix.com/ng/' target='_blank'> www.netflix.com</a>.
          </small>
        </form>
      </div>
    </div>
  );
}
