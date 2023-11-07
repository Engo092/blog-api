const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    isPublished: { type: Boolean, required: true },
    timestamp: { type: Date, default: Date.now , required: true },
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
});

PostSchema.virtual("formatted_timestamp").get(function() {
    return this._id.getTimestamp().toDateString();
});

PostSchema.virtual("url").get(function() {
    return `/posts/${this._id}`;
});

module.exports = mongoose.model("Post", PostSchema);