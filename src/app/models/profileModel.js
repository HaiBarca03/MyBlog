const mongoose = require('mongoose');

const profileModel = new mongoose.Schema({
    user_id: {
      type: String,
      required: true,
      unique: true
    },
    featured_tags: {
      type: [String], // Mảng chứa các tag nổi bật
      default: []
    },
    social_links: {
      facebook: {
        type: String
      },
      instagram: {
        type: String
      },
      zalo: {
        type: String
      }
    },
    story: {
      caption: {
        type: String
      },
      country: {
        type: String
      },
      work: {
        type: String
      }
    }
  });
  
  // Tạo model dựa trên schema
  const ProfileUser = mongoose.model('ProfileUser', profileModel);
  
  module.exports = ProfileUser;