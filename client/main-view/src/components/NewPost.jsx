import { useEffect, useState, useRef } from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import '../styles/NewPost.css'
import ErrorList from './ErrorList'

function NewPost() {
  const {
    token: token,
		setIsCreating: setIsCreating,
	} = useOutletContext();
  const navigate = useNavigate();

  const [submitErrors, setSubmitErrors] = useState([]);

  const titleRef = useRef();
  const contentRef = useRef();
  const isPublishedRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const title = titleRef.current.value;
    const content = contentRef.current.value;
    const isPublished = isPublishedRef.current.checked;

    try {
      const reqResponse = await fetch("http://localhost:3000/api/blogauthor/newpost", {
        method: "post",
        credentials: "include",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `bearer ${token}`,
        },
        body: JSON.stringify({
          title: title,
          content: content,
          isPublished: isPublished,
        }),
      });
      const response = await reqResponse.json();
      if (response.isAuthorized !== undefined && response.isAuthorized === false) {
        navigate("/");
      }
      if (response.errors) {
        const errorArray = [];
        response.errors.forEach(function(error) {
          if (!errorArray.includes(error.msg)) {
            errorArray.push(error.msg);
          }
        });
        setSubmitErrors(errorArray);
      } else {
        setSubmitErrors([]);
        if (response.messages) {
          // means there are authentication errors
          const errorArray = [];
          response.messages.forEach(function(err) {
            errorArray.push(err);
          });
          setSubmitErrors(errorArray);
        } else {
          setIsCreating(false);
          navigate("/create");
        }
      }
    } catch(err) {
      alert("Connection error detected: " + err);
    }
  }

  return (
    <div className="createPost">
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Post Title</label>
        <input type="text" name="title" placeholder="Post Title" ref={titleRef} required />
        <label htmlFor="content">Content</label>
        <textarea name='content' placeholder='Post Content' ref={contentRef} required />
        <span className='checkboxSpan'>
          <label htmlFor="isPublished">Publish now?</label>
          <input type="checkbox" name="isPublished" ref={isPublishedRef} />
        </span>
        <button type='submit' className='submit'>Submit</button>
      </form>

      {submitErrors.length > 0 ? (
          <ErrorList errList={submitErrors} />
        ) : ''}
    </div>
  );
}

export default NewPost