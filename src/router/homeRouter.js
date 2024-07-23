const express = require('express');
const router = express.Router();
const {getHome} = require('../app/controllers/postsController')

router.get('/home', getHome, (req, res) => {
  res.redirect('/home');
});
router.get('/', getHome, (req, res) => {
  res.redirect('/');
});

// router.get('/', getHome => {
//   res.redirect('/home'); // Chuyển hướng đến /home với user_id mặc định là '01'
// });

module.exports = router;