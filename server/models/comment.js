const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    message: { type: String, required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true},
    timestamp: { type: Date, default: Date.now , required: true },
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
});

CommentSchema.virtual("formatted_timestamp").get(function() {
    return this._id.getTimestamp().toDateString();
});

CommentSchema.set('toObject', { virtuals: true });
CommentSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model("Comment", CommentSchema);