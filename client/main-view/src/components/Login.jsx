import { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/Login.css'
import ErrorList from './ErrorList'

function Login() {
  const [loginErrors, setLoginErrors] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/api/login", { credentials: 'include' })
      .then((res) => res.json())
      .then((res) => {
        if (res.isAuthenticated === true) {
          navigate("/");
        }
      });
  }, []);

  const emailRef = useRef();
  const passwordRef = useRef();
    
  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = emailRef.current.value;
    const password= passwordRef.current.value;
    
    try {
      const reqResponse = await fetch("http://localhost:3000/api/login", {
        method: "post",
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      const response = await reqResponse.json()
      if (response.errors) {
        const errorArray = [];
        response.errors.forEach(function(error) {
          if (!errorArray.includes(error.msg)) {
            errorArray.push(error.msg);
          }
        });
        setLoginErrors(errorArray);
      } else {
        setLoginErrors([]);
        if (response.messages) {
          // means there are authentication errors
          const errorArray = [];
          response.messages.forEach(function(err) {
            errorArray.push(err);
          });
          setLoginErrors(errorArray);
        } else {
          navigate("/");
        }
      }
    } catch(err) {
      alert("Connection Error detected: " + err);
    }
  }

  return (
    <>
      <header>
        <h1>The Rolling Rocks</h1>
        <Link to="/">Main</Link>
      </header>
      <section>
        <div className="loginContent">
          <h2>Log In</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">E-mail:</label>
            <input type="email" name="email" placeholder='E-mail' ref={emailRef} required />
            <label htmlFor="password">Password:</label>
            <input type="password" name="password" placeholder='Password' minLength='6' ref={passwordRef} required />

            <button type='submit' className='submit'>Log In</button>
          </form>
          <p className='signup'>Don't have an account? <Link to="/signup">Sign Up</Link></p>

          {loginErrors.length > 0 ? (
            <ErrorList errList={loginErrors} />
          ) : ''}
        </div>
      </section>
    </>
  );
}

export default Login
