import { useEffect, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import '../styles/App.css'

function App() {
  const {error: error,
		loading: loading,
		serverResponse: serverResponse,
	} = useOutletContext();

  if (error) return (
    <div className='mainContent'>
      <h2>A network error was encountered</h2>
    </div>
  );
  if (loading === true) return (
    <div className='mainContent'>
      <h2>Loading...</h2>
    </div>
  );
  
  return (
    <div className="mainContent">
      <h2>Welcome to The Rolling Rocks! Check out our latest posts:</h2>
      <section className='postList'>
        {serverResponse && serverResponse.posts.length > 0 ? (
          <ul>
          {serverResponse.posts.map((post) => {
            return (
              <li className='postInfo' key={post._id}>
                <div className='postHeader'>
                  <Link to={post.url} className='postTitle'>{post.title}</Link>
                  <p className='postTimestamp'>{post.formatted_timestamp}</p>
                </div>
                <div className='postDesc'>
                  <p>{post.contentPreview}</p>
                </div>
              </li>
            );
          })}
          </ul>
        ) : (
          <p className='noPosts'>Oh no! It looks like no one has posted here yet!</p>
        )}
      </section>
    </div>
  );
}

export default App
