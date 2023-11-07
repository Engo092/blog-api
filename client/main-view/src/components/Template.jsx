import { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import '../styles/template.css'

function Template() {
  const [serverResponse, setServerResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasLoggedOut, setHasLoggedOut] = useState(false);
  const [reloadPosts, setReloadPosts] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (reloadPosts) {
      setReloadPosts(false);
    } else {
      fetch("http://localhost:3000/api", {
        credentials: 'include',
      })
        .then((res) => res.json())
        .then((res) => {
          setServerResponse(res)
        })
        .catch((err) => setError(err))
        .finally(setLoading(false));
    }
  }, [hasLoggedOut, reloadPosts]);

  const logout = () => {
    fetch("http://localhost:3000/api/logout", {
      credentials: 'include',
    })
      .then(() => setHasLoggedOut(true))
      .catch((err) => setError(err));
  }

  const redirectHandler = () => {
    setReloadPosts(true);
    navigate("/");
  }

  return (
    <>
      <header>
        {serverResponse && serverResponse.isAuthenticated === true ? (
          <div className='userInfo'>
            {serverResponse.isAdmin === true ? (
              <>
                <p className='userName toHide' >{serverResponse.username}</p>
                <Link to="/create" className='admin'>Edit Blog</Link>
              </>
            ) : (
              <p className='userName' >{serverResponse.username}</p>
            )}
          </div>
        ) : ''}
        <h1><button onClick={(redirectHandler)} className='mainRedirect'>The Rolling Rocks</button></h1>
        {serverResponse && serverResponse.isAuthenticated === true ? (
          <button className='logout' onClick={logout}>Log Out</button>
        ) : (
          <Link className='login' to="/login">Log In</Link>
        )}
        
      </header>
      <section>
        <Outlet context={{error: error, loading: loading, serverResponse: serverResponse}} />
      </section>
    </>
  );
}

export default Template
