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
    categories: [String], // You can create a separate Category model for more complex relationships
    comments: [{
      author: String,
      content: String,
      date: Date,
    }],
    media: {
      images: [String], // Array of image URLs
      videos: [String] // Single video URL
    },
  });

// const postsModels = new mongoose.Schema({
//     username: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     profile: { type: profileSchema, required: true }
// });

//const User = mongoose.model('User', userSchema);

const Posts = mongoose.model('Posts', postsModels)

module.exports = Posts