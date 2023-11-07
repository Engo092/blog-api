const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Post = require('../models/post');
const asyncHandler = require('express-async-handler');
const post_controller = require('../controllers/postController');

const router = express.Router();

require('dotenv').config();

router.get('/', asyncHandler(async function(req, res, next) {
  if (!req.user || req.user.isAdmin !== true) {
    res.json({
      isAuthorized: false,
      status: 401,
    });
  } else {
    const user = await User.findById(req.user._id);
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
      ]
    );

    const posts = postList.map(post => Post.hydrate(post));
    jwt.sign({ user }, process.env.SECRET_KEY, { expiresIn: '24h' }, (err, token) => {
      res.json({
        isAuthorized: true,
        token: token,
        user: user,
        posts: posts.length > 0 ? posts : [],
      });
    });
  }
}));

router.get('/newpost', verifyToken, post_controller.create_post_get);

router.post('/newpost', verifyToken, post_controller.create_post_post);

router.get('/delete/:postId', verifyToken, post_controller.delete_post_get);

router.get('/publish/:postId', verifyToken, post_controller.publish_post_get);


function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];

    // Checks if token is valid
    jwt.verify(bearerToken, process.env.SECRET_KEY, (err, authData) => {
      if (err) {
        res.json({
          isAuthorized: false,
          status: 403,
        });
      } else {
        req.authData = authData;
      }
    });
    next();
  } else {
    // Forbidden
    res.json({
      isAuthorized: false,
      status: 401,
    });
  }
}

module.exports = router;