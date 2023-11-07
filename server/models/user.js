const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    isAdmin: { type: Boolean },
});

module.exports = mongoose.model("User", UserSchema);