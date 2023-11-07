const User = require('../models/user');

const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');

exports.user_login_get = asyncHandler(async (req, res, next) => {
    // clears any login error messages
    if (req.session.messages) {
        req.session.messages = null;
    }
    if (!req.user) {
        res.json({
            isAuthenticated: false,
        });
    } else {
        res.json({
            isAuthenticated: true,
        });
    }
});

exports.user_login_post = [
    body("email")
        .trim()
        .isLength({ min: 1 })
        .withMessage("email must be specified")
        .isEmail()
        .withMessage("please provide a valid email")
        .escape(),
    body("password", "please provide a valid password (minimum: 6 characters)").trim().isLength({ min: 6 }).escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.json({ errors: errors.array() });
            return;
        } else {
            // clears any previous login error messages
            if (req.session.messages) {
                req.session.messages = null;
            }
            
            passport.authenticate("local", {
                successRedirect: "/api/login/success",
                failureRedirect: "/api/login/failure",
                failureMessage: true,
            })(req, res, next);
        }
    })
];

exports.user_signup_get = asyncHandler(async (req, res, next) => {
    // clears any login error messages
    if (req.session.messages) {
        req.session.messages = null;
    }
    if (!req.user) {
    res.json({
        isAuthenticated: false,
    });
    } else {
        res.json({
            isAuthenticated: true,
        });
    }
});

exports.user_signup_post = [
    // validate and sanitize fields
    body("username", "username must not be empty").trim().isLength({ min: 1 }).escape(),
    body("password", "please provide a valid password").trim().isLength({ min: 6 }).escape(),
    body("email")
        .trim()
        .isLength({ min: 1 })
        .withMessage("email must be specified")
        .isEmail()
        .withMessage("please provide a valid email")
        .custom(async value => {
            const user = await User.findOne({ email: value });
            if (user) {
                throw new Error("email already in use");
            }
        })
        .escape(),

    async (req, res, next) => {
        try {
            bcrypt.hash(req.body.password, 10 , async (err, hashedPassword) => {
                if (err) {
                    return next(err);
                } else {
                    const errors = validationResult(req);

                    const user = new User({
                        username: req.body.username,
                        password: hashedPassword,
                        email: req.body.email,
                    });

                    if (!errors.isEmpty()) {
                        res.json({ errors: errors.array() });
                        return;
                    } else {
                        await user.save();
                        res.json({ message: "signup OK, please log in now" });
                    }
                }
            });
        } catch(err) {
            return next(err);
        }
    }
];

exports.user_logout_get = asyncHandler(async (req, res, next) => {
    req.logout((err) => {
        if (err) {
            next(err);
        }
    });
    res.json({message: "logged out"});
});

exports.user_login_success = asyncHandler(async (req, res, next) => {
    if (req.user) {
        res.json({ message: "login OK", account: `logged in as ${req.user.username}` });
    } else {
        res.redirect("/api/login");
    }
});

exports.user_login_failure = asyncHandler(async (req, res, next) => {
    res.json(req.session);
});