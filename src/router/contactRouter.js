const express = require('express')
const contact = require('../app/models/contactModel')
const {getContact, getContactByUserId, createContactByUserId, updateContactByUserId} = require('../app/controllers/contactController')
const router = express.Router()

router.get('/contact', getContact)
router.get('/contact/:user_id', getContactByUserId);
router.post('/contact/:user_id', createContactByUserId);
router.put('/contact/:user_id', updateContactByUserId);

module.exports = router