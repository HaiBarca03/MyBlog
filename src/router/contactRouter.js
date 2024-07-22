const express = require('express')
const contact = require('../app/models/contactModel')
const {authenticate} = require('../middleware/authMiddleware');
const {getContact, getContactByUserId, createContactByUserId, updateContactByUserId, submitContactForm} = require('../app/controllers/contactController')
const router = express.Router()

// router.get('/contact', renderContactPage)
router.get('/contact/', authenticate, getContactByUserId);
// router.post('/contact/:user_id', createContactByUserId);
router.post('/contact/submit', authenticate, submitContactForm);
router.put('/contact/:user_id', updateContactByUserId);

module.exports = router