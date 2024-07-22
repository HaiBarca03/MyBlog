const mongoose = require('mongoose');
const Users = require('../models/userModel');
const contact = require('../models/contactModel');
const Feedback = require('../models/feedbackModel')

// Get all contact details
const getContact = async (req, res) => {
    try {
      const contacts = await contact.find({}); // Fetch all contacts
  
      res.status(200).json({
        status: 'success',
        result: contacts.length,
        data: {
          contacts
        }
      });
    } catch (error) {
      console.error('Error fetching contact details:', error);
      res.status(500).json({
        status: 'fail',
        message: 'Unable to fetch contact details.'
      });
    }
  };
  
  // Get a specific contact by user_id
  const getContactByUserId = async (req, res) => {
    const successMessage = req.query.message;
    try {
      const user_id = '01'; // Fix cứng user_id là 01

      // Tìm kiếm thông tin liên hệ của user_id = 01
      const contacts = await contact.findOne({ user_id });

      if (!contacts) {
          return res.status(404).render('err', {
              layout: 'main',
              message: 'Contact not found!'
            });
          }
          
          res.render('contact', {
            layout: 'main',
            contacts: contacts,
            isAuthenticated: !!req.user, // Xác định trạng thái đăng nhập
            user: req.user,
            successMessage
      });
  } catch (error) {
      console.error('Error fetching contact details by user_id:', error);
      res.status(500).render('error', {
          layout: 'main',
          message: 'Unable to fetch contact details by user_id.'
      });
  }
};

const submitContactForm = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'fail',
        message: 'You must be logged in to submit feedback.'
      });
    }

    const { name, email, message } = req.body;
    const newFeedback = new Feedback({
      user_id: req.user.user_id,
      name,
      email,
      message
    });

    await newFeedback.save();
    res.redirect('/contact?message=feedback_success'); // Redirect to the contact page after successful submission
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).render('error', {
      layout: 'main',
      message: 'Unable to submit feedback.'
    });
  }
};

// Create a new contact by user_id
const createContactByUserId = async (req, res) => {
  try {
    const { user_id } = req.params; // Lấy user_id từ tham số của yêu cầu
    const { name, email, phoneNumber, address, socialLinks, collaborationInfo } = req.body;

    // Kiểm tra xem đã có contact cho user_id này chưa
    const existingContact = await contact.findOne({ user_id });
    
    if (existingContact) {
      return res.status(400).json({
        status: 'fail',
        message: 'Contact already exists for this user!'
      });
    }

    // Tạo thông tin liên hệ mới với user_id đã cho
    const newContact = await contact.create({
      user_id,
      name,
      email,
      phoneNumber,
      address,
      socialLinks,
      collaborationInfo
    });

    res.status(201).json({
      status: 'success',
      data: {
        contact: newContact
      }
    });
  } catch (error) {
    console.error('Error creating contact by user_id:', error);
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!, đã có contact'
    });
  }
};

  // Update contact details by user_id
const updateContactByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;
    const updateData = req.body;  // Dữ liệu cập nhật từ yêu cầu

    // Tìm và cập nhật thông tin liên hệ dựa trên user_id
    const updatedContact = await contact.findOneAndUpdate(
      { user_id },
      updateData,
      { new: true, runValidators: true }  // new: true để trả về tài liệu đã cập nhật, runValidators: true để chạy các validater
    );

    if (!updatedContact) {
      return res.status(404).json({
        status: 'fail',
        message: 'Contact not found!'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        contact: updatedContact
      }
    });
  } catch (error) {
    console.error('Error updating contact details by user_id:', error);
    res.status(500).json({
      status: 'fail',
      message: 'Unable to update contact details.'
    });
  }
};

module.exports = {
    getContact,
    getContactByUserId,
    createContactByUserId,
    updateContactByUserId,
    submitContactForm
};