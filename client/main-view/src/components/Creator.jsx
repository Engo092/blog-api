import { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate, useOutletContext } from 'react-router-dom'
import '../styles/Creator.css'

function Creator() {
	const navigate = useNavigate();
	const {
    error: error,
		loading: loading,
		serverResponse: serverResponse,
	} = useOutletContext();

	const [token, setToken] = useState(null);
  const [postList, setPostList] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [hasDeletedOrPublished, setHasDeletedOrPublished] = useState(false);

	
	useEffect(() => {
    if (hasDeletedOrPublished === true) {
      // This forces the page to re-render after every deleted or published post, updating the list
      setHasDeletedOrPublished(false);
    } else {
      fetch('http://localhost:3000/api/blogauthor', {
        credentials: 'include',
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.isAuthorized !== true) {
            navigate("/");
          } else {
            setToken(res.token);
            setPostList(res.posts);
          }
        })
        .catch((err) => alert(err));
    }
	}, [isCreating, hasDeletedOrPublished]);

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
  if (serverResponse && serverResponse.isAdmin !== true) {
    navigate("/");
  }

  const newPostButtonClick = () => {
    setIsCreating(true);
    navigate("/create/newPost");
  }

  const cancelPostButtonClick = () => {
    setIsCreating(false);
    navigate("/create");
  }

  const deletePost = async (postId) => {
    try {
      const reqResponse = await fetch(`http://localhost:3000/api/blogauthor/delete/${postId}`, {
        credentials: "include",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `bearer ${token}`,
        },
      });
      const response = await reqResponse.json();
      setHasDeletedOrPublished(true);
    } catch(err) {
      alert(err);
    }
  }

  const publishPost = async (postId) => {
    try {
      const reqResponse = await fetch(`http://localhost:3000/api/blogauthor/publish/${postId}`, {
        credentials: "include",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `bearer ${token}`,
        },
      });
      const response = await reqResponse.json();
      setHasDeletedOrPublished(true);
    } catch(err) {
      alert(err);
    }
  }

  return (
    <div className="mainContent">
      <h2>Hello Admin, Welcome Back!</h2>
      {isCreating ? (
        <>
          <div className='cancelPost'>
            <button onClick={cancelPostButtonClick} className='cancelPostBtn'>Cancel</button>
          </div>
          <Outlet context={{token: token, setIsCreating: (value) => setIsCreating(value)}} />
        </>
      ) : (
        <>
          <div className='newPost'>
            <button onClick={newPostButtonClick} className='newPostBtn'>Create Post</button>
          </div>
          <section className='postList'>
            {postList.length > 0 ? (
              <ul>
              {postList.map((post) => {
                return (
                  <li className='postInfo' key={post._id}>
                    <div className='postHeader'>
                      <span className='postHeaderSpan'>
                        <Link to={post.url} className='postTitle'>{post.title}</Link>
                        <button onClick={() => deletePost(post._id)} className='deletePost'>DELETE</button>
                        {post.isPublished === false ? (
                          <button onClick={() => publishPost(post._id)} className='publishPost'>Publish</button>
                        ) : ''}
                      </span>
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
              <p className='noPosts'>There are no posts yet. Create a new one!</p>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default Creator
