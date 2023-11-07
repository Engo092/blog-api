const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');

const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

require('dotenv').config();

exports.view_message_get = asyncHandler(async (req, res, next) => {
    const comments = await Comment.find({post: req.params.postid}).populate("user", "username").sort({timestamp: -1}).exec();
    res.json({
        comments: comments,
    })
})

exports.create_message_post = [

    // Validate and sanitize fields
    body("comment", "comment must not be empty").trim().isLength({ min: 1 }).escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const user = await User.findById(req.user._id).exec();
        if (!user) {
            throw new Error("User not found");
        }

        const comment = new Comment({
            message: req.body.comment,
            post: req.body.post,
            user: req.user._id,
        });

        if (!errors.isEmpty()) {
            res.json({
                errors: errors.array(), 
                post: {
                    message: req.body.comment,
                    post: req.body.post,
                    user: req.user._id,
                },
            });
            return;
        } else {
            await comment.save();
            res.json({ 
                message: "Comment has been created",
            });
        }
    })
];