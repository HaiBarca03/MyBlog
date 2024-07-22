const express = require('express')
const { getRegister,
        postRegister,
        getLogin,
        postLogin,
        logout } = require('../app/controllers/authController')
const router = express.Router()

router.get('/login', getLogin);
router.post('/login', postLogin);
router.get('/register', getRegister);
router.post('/register', postRegister);
router.get('/logout', logout);

module.exports = router