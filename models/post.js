const mongoose = require('mongoose');

const { Schema } = mongoose;

const postSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Post must have title']
  },
  body: {
    type: String,
    required: [true, 'Post must have body']
  }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
