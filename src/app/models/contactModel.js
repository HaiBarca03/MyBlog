const mongoose = require('mongoose');

const contactModels = new mongoose.Schema({
//   _id: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true
//   },
  user_id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true // Ensures email is unique
  },
  phoneNumber: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  socialLinks: {
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
  collaborationInfo: {
    type: String
  },
  formSubmissions: [
    {
      name: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      },
      message: {
        type: String,
        required: true
      },
      submittedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const contact = mongoose.model('contact', contactModels);

module.exports = contact;