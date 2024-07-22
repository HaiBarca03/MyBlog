const mongoose = require('mongoose')

const profileUserModel = new mongoose.Schema({
  name: {
      type: String,
      //required: true
  },
  bio: {
      type: String
  },
  profile_picture: {
      type: String
  },
  skills: {
      type: [String],
      default: []
  },
  achievements: {
      type: [String],
      default: []
  }
});

const userModel = new mongoose.Schema({
  username: {
      type: String,
      required: true
  },
  password: {
      type: String,
      required: true
  },
  email: {
      type: String,
      required: true,
      unique: true
  },
  profile: {
      type: profileUserModel,
      default: {
          name: '',  // Default empty name
          bio: '',   // Default empty bio
          profile_picture: '',  // Default empty profile picture URL
          skills: [],  // Default empty skills array
          achievements: []  // Default empty achievements array
      }
  },
  user_id: {
      type: String,
      required: true,
      unique: true
  },
  admin: {
    type: Boolean,
    default: false
  },
  createdAt: {
      type: Date,
      default: Date.now
  },
  updatedAt: {
      type: Date,
      default: Date.now
  }
});
  
  const Users = mongoose.model('Users', userModel);
  
  module.exports = Users;