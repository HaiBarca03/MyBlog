const mongoose = require('mongoose');
const Posts = require('../models/postsModel')   

const CategorySchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Posts' // Reference to Post documents
  }],
  slug: {
    type: String,
    required: true
  },
  user_id: {
    type: String,
    required: true
  }
}, {
  collection: 'categories' 
});

// Create the Category model
const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;