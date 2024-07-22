const express = require('express')
const users = require('../app/models/userModel')
const {authenticate} = require('../middleware/authMiddleware');
const {
    getProfileUserByUserId, 
    createProfileUser, 
    updateProfileUser,
    deleteProfileUser,
    deleteProfileUserFields,
    getAccUserByUserId, 
    createUser, 
    updateUserByUserId, 
    updateUser, 
    deleteUserByUserId} = require('../app/controllers/userController')
const router = express.Router()

// router.get('/profile/:user_id', getProfileUserByUserId);
router.get('/profile/', authenticate, getProfileUserByUserId);
router.post('/users/profile/:user_id', createProfileUser);
router.put('/users/profile/:user_id', updateProfileUser);
router.delete('/users/profile/:user_id', deleteProfileUser);
router.delete('/users/profile/:user_id/delete-fields', deleteProfileUserFields);

router.get('/acc/:user_id', getAccUserByUserId);
router.post('/acc/', createUser);
router.patch('/acc/profile/:user_id', updateUserByUserId);
router.put('/acc/user/:user_id', updateUser);
router.delete('/acc/:user_id', deleteUserByUserId);

module.exports = router