const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();


const user_controller = require('../controllers/userController');
const post_controller = require('../controllers/postController');
const comment_controller = require('../controllers/commentController');
const Post = require('../models/post');

// Home page tells front-end if user is authenticated or not
router.get('/', asyncHandler(async (req, res, next) => {
  // Gets posts list for display, with a limit of content characters

  const postList = await Post.aggregate(
    [
      {
        $project:
          {
            title: 1,
            isPublished: 1,
            timestamp: 1,
            contentPreview: { $substr: [ "$content", 0, 130 ] },
          }
      },
      {
        $sort:
          {
            timestamp: -1,
          }
      },
    ],
  );
  const posts = postList.filter(function(post) {
    // Filters posts that aren't published
    if (post.isPublished === true) {
      return true;
    }
    return false;
  }).map(post => {
    return Post.hydrate(post);
  });

  if (!req.user) {
    res.json({
      isAuthenticated: false,
      posts: posts,
    });
  } else {
    if (req.user.isAdmin !== true) {
      res.json({
        isAuthenticated: true,
        posts: posts,
        username: req.user.username,
      });
    } else {
      res.json({
        isAuthenticated: true,
        isAdmin: true,
        posts: posts,
        username: req.user.username,
      });
    }
  }
}));

router.get('/login', user_controller.user_login_get);

router.post('/login', user_controller.user_login_post);

router.get('/signup', user_controller.user_signup_get);

router.post('/signup', user_controller.user_signup_post);

router.get('/login/success', user_controller.user_login_success);

router.get('/login/failure', user_controller.user_login_failure);

router.get('/logout', user_controller.user_logout_get);

router.get('/posts/:postid', post_controller.view_post_get);

router.post('/comments', comment_controller.create_message_post);

router.get('/comments/:postid', comment_controller.view_message_get);

module.exports = router;
