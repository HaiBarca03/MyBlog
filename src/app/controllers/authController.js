const Users = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getLogin = async(req, res) => {
  res.render('login')
}

const getRegister = async(req, res) => {
  res.render('register')
}

const postLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
      const user = await Users.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
          return res.redirect('/login?message=invalid_credentials');
      }

      const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.cookie('token', token, { httpOnly: true }); // Ghi cookie với token
      res.redirect('/profile'); // Chuyển hướng đến trang profile
  } catch (error) {
      console.error('Login error:', error);
      res.redirect('/login?message=server_error');
  }
};

const postRegister = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.redirect('/register?message=passwords_do_not_match');
  }

  if (!username || !email || !password) {
    return res.redirect('/register?message=all_fields_required');
  }

  try {
    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tìm user_id lớn nhất hiện tại và chuyển đổi thành số nguyên
    const lastUser = await Users.findOne().sort({ user_id: -1 });
    const lastUserId = lastUser ? parseInt(lastUser.user_id, 10) : 0;
    const newUserId = (lastUserId + 1).toString().padStart(2, '0');

    // Tạo người dùng mới
    const newUser = new Users({
      username,
      email,
      password: hashedPassword,
      user_id: newUserId,
      profile: {
        name: '',
        bio: '',
        profile_picture: '',
        skills: [],
        achievements: [],
      },
      admin: newUserId === '01' // Đặt admin thành true chỉ nếu user_id là 01
    });

    // Lưu người dùng mới vào cơ sở dữ liệu
    await newUser.save();

    // Chuyển hướng với thông báo thành công
    res.redirect('/login?message=registration_successful');
  } catch (error) {
    console.error(error);
    res.redirect('/register?message=server_error');
  }
};

const logout = (req, res) => {
  res.clearCookie('token'); // Xoá cookie chứa JWT
  res.redirect('/login');   // Chuyển hướng về trang đăng nhập
};

module.exports = { 
  postRegister,
  getRegister,
  getLogin,
  postLogin,
  logout
}