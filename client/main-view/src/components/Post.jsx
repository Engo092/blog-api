import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useOutletContext } from 'react-router-dom'
import '../styles/Post.css'

function Post() {
  const id = useParams();
  const {
    error: error,
		loading: loading,
		serverResponse: serverResponse,
	} = useOutletContext();

  const commentRef = useRef();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState(false);

  useEffect(() => {
      fetch(`http://localhost:3000/api/posts/${id.postId}`, {
        credentials: 'include',
      })
        .then((res) => res.json())
        .then((res) => {
          setPost(res.post);
          setComments(res.comments);
        })
        .catch((err) => alert(err));
  }, []);

  useEffect(() => {
    if (newComment === true) {
      setNewComment(false);
    } else {
      fetch(`http://localhost:3000/api/comments/${id.postId}`, {
        credentials: 'include',
      })
        .then((res) => res.json())
        .then((res) => setComments(res.comments))
        .catch((err) => alert(err));
    }
  }, [newComment]);

  const sendMessage = async (e) => {
    e.preventDefault();

    const comment = commentRef.current.value;

    try {
      const reqResponse = await fetch("http://localhost:3000/api/comments", {
        method: "post",
        credentials: "include",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comment: comment,
          post: id.postId,
        }),
      });
      const response = await reqResponse.json();
      setNewComment(true);
      commentRef.current.value = '';
    } catch(err) {
      alert("Connection error detected: " + err);
    }
  }

  if (error) return (
    <div className='postContent'>
      <h2>A network error was encountered</h2>
    </div>
  );
  if (loading === true) return (
    <div className='postContent'>
      <h2>Loading...</h2>
    </div>
  );

  return (
    <div className='postBox'>
      {post ? (
        <>
          <span className='postViewHeader'>
            <h2 className='postTitle'>{post.title}</h2>
            <p className='postDate'>{post.formatted_timestamp}</p>
          </span>
          <div className='postContent'>{post.content}</div>
          <div className='comments'>
            <h2 className='commentsHeader'>Comments</h2>
            <hr />
            {serverResponse.isAuthenticated ? (
              <form onSubmit={sendMessage} className='commentForm'>
                <label htmlFor="comment">Write your thoughts:</label>
                <textarea name="comment" id="comment" placeholder='Comment' ref={commentRef} required></textarea>
                <button type='submit' className='postComment'>Post Comment</button>
              </form>
            ) : (
              <p className='loginNotice'>You must be logged in to post comments.</p>
            )}
            {comments.length > 0 ? (
              comments.map((comment) => {
                return (
                  <div className='commentsDisplay' key={comment._id}>
                    <div className='commentHeader'>
                      <span>Sent By <strong>{comment.user.username}</strong> at <strong>{comment.formatted_timestamp}</strong></span>
                      <p>{comment.message}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className='noCommentsDisplay'>
                <h3>There are no comments yet, be the first!</h3>
              </div>
            )}
          </div>
        </>
      ) : (
        <h2>Retrieving post...</h2>
      )}
    </div>
  );
}

export default Post