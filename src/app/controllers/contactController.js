const mongoose = require('mongoose');
const contact = require('../models/contactModel');

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
    try {
      const { user_id } = req.params;
      const contacts = await contact.findOne({ user_id }); // Fetch contact by user_id
  
      if (!contacts) {
        return res.status(404).json({
          status: 'fail',
          message: 'Contact not found!'
        });
      }
  
      res.status(200).json({
        status: 'success',
        data: {
            contacts
        }
      });
    } catch (error) {
      console.error('Error fetching contact details by user_id:', error);
      res.status(500).json({
        status: 'fail',
        message: 'Unable to fetch contact details by user_id.'
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
    updateContactByUserId
};