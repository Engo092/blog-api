import React from 'react'
import ReactDOM from 'react-dom/client'
import Template from './components/Template'
import App from './components/App.jsx'
import Login from './components/Login.jsx'
import Signup from './components/Signup.jsx'
import Creator from './components/Creator'
import Post from './components/Post.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import NewPost from './components/newPost'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Template />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/create",
        element: <Creator />,
        children: [
          {
            path: "/create/newPost",
            element: <NewPost />,
          }
        ],
      },
      {
        path: "/posts/:postId",
        element: <Post />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);