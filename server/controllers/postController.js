const Post = require('../models/post');
const Comment = require('../models/comment');

const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const jwt = require('jsonwebtoken');

require('dotenv').config();

exports.create_post_get = asyncHandler(async (req, res, next) => {
    res.json({
        message: "User authorized",
    });
});

exports.create_post_post = [

    // Validate and sanitize fields
    body("title", "title must not be empty").trim().isLength({ min: 1 }).escape(),
    body("content", "post requires content").trim().isLength({ min: 1 }).escape(),
    body("isPublished.*").escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const post = new Post({
            title: req.body.title,
            content: req.body.content,
            isPublished: req.body.isPublished,
        });

        if (!errors.isEmpty()) {
            res.json({
                errors: errors.array(), 
                post: {
                    title: req.body.title,
                    content: req.body.content,
                    isPublished: req.body.isPublished,
                },
            });
            return;
        } else {
            await post.save();
            res.json({ 
                message: "Post has been saved",
            });
        }
    })
];

exports.delete_post_get = asyncHandler(async (req, res, next) => {
    await Comment.deleteMany({"post": req.params.postId}).exec();
    await Post.findByIdAndRemove(req.params.postId).exec();
    res.json({
        message: "Post has been deleted",
    });
});

exports.view_post_get = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.postid).exec();

    const comments = await Comment.find({post: req.params.postid}).populate("user", "username").sort({timestamp: -1}).exec();

    if (req.user) {
        res.json({
            post: post,
            comments: comments,
            isAuthorized: true,
        });
    } else {
        res.json({
            post: post,
            comments: comments,
        });
    }
});

exports.publish_post_get = asyncHandler(async (req, res, next) => {
    await Post.findByIdAndUpdate(req.params.postId, {isPublished: true}).exec();
    res.json({ message: "post published"});
})