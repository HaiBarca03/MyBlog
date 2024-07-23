const mongoose = require('mongoose')

const postsModels = new mongoose.Schema({

    user_id: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    slug: {
      type: String,
      required: true,
      unique: true, // Ensure a unique slug for each post
    },
    tags: [String],
    title: {
      type: String,
      required: true,
    },
    categories: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    }],
    comments: [{
      author: String,
      content: String,
      date: Date,
    }],
    likeCount: { type: Number, default: 0 },
    media: {
      images: [String], // Array of image URLs
      videos: [String] // Single video URL
    },
  });


postsModels.index({ title: 'text', content: 'text', author: 'text', tags: 'text' });

const Posts = mongoose.model('Posts', postsModels)

module.exports = Posts