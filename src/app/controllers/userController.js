const Users = require('../models/userModel');
const Posts = require('../models/postsModel')
const ProfileUser = require('../models/profileModel');
// Get profile user by user_id

const getProfileUserByUserId = async (req, res) => {
  try {
      // const user_id = req.user.user_id; // Lấy user_id từ req.user
      const user_id = req.user ? req.user.user_id : null;
      if (!user_id) {
        // Khi không có user_id (người dùng chưa đăng nhập)
        return res.render('userProfile', {
            layout: 'main',
            profile: null,
            profileUser: null,
            posts: []
        });
    }
      // Chạy ba truy vấn song song
      const [profileUser, posts] = await Promise.all([
          ProfileUser.findOne({ user_id }),
          Posts.find({ user_id })
      ]);

      // if (!profileUser) {
      //   return res.status(404).json({
      //     status: 'fail',
      //     message: 'Additional profile information not found!'
      //   });
      // }

      res.status(200).render('userProfile', {
        status: 'success',
        data: {
          profile: req.user.profile,
          profileUser: profileUser,
          posts: posts
        }
      });

  } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).json({
        status: 'fail',
        message: 'Unable to fetch profile.'
      });
  }
};


// Tạo ProfileUser
const createProfileUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Kiểm tra xem user có tồn tại trong Users không
    const user = await Users.findOne({ user_id });
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found in Users collection.'
      });
    }

    // Kiểm tra xem user_id đã có ProfileUser chưa
    const profileUserExists = await ProfileUser.findOne({ user_id: user.user_id });
    if (profileUserExists) {
      return res.status(400).json({
        status: 'fail',
        message: 'ProfileUser already exists for this user_id.'
      });
    }

    // Tạo ProfileUser mới với user_id từ Users
    const newProfileUser = new ProfileUser({
      ...req.body,
      user_id: user.user_id // Tự động thêm user_id từ Users
    });
    await newProfileUser.save();

    res.status(201).json({
      status: 'success',
      data: {
        profileUser: newProfileUser
      }
    });
  } catch (error) {
    console.error('Error creating ProfileUser:', error);
    res.status(500).json({
      status: 'fail',
      message: 'Unable to create ProfileUser.'
    });
  }
};

// Cập nhật ProfileUser
const updateProfileUser = async (req, res) => {
  try {
    const user_id = req.user ? req.user.user_id : null;

    if (!user_id) {
      return res.status(401).json({
        status: 'fail',
        message: 'Unauthorized. User ID is required.'
      });
    }

    // Find the user
    const user = await Users.findOne({ user_id });
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found.'
      });
    }

    // Update user profile
    const userProfileData = {
      name: req.body.name,
      bio: req.body.bio,
      profile_picture: req.body.profile_picture,
      skills: req.body.skills,
      achievements: req.body.achievements
    };

    user.profile = { ...user.profile, ...userProfileData };
    user.updatedAt = new Date();

    // Find or create ProfileUser
    let profileUser = await ProfileUser.findOne({ user_id });
    if (!profileUser) {
      profileUser = new ProfileUser({ user_id });
    }

    // Update ProfileUser
    const profileUserData = {
      featured_tags: req.body.featured_tags,
      social_links: {
        facebook: req.body.facebook,
        instagram: req.body.instagram,
        zalo: req.body.zalo
      },
      story: {
        caption: req.body.caption,
        country: req.body.country,
        work: req.body.work
      }
    };

    Object.assign(profileUser, profileUserData);

    // Save both documents
    await Promise.all([user.save(), profileUser.save()]);
    res.status(200).json({
      status: 'success',
      data: {
        user: {
          ...user.toObject(),
          profileUser: profileUser.toObject()
        }
      }
    });
    // res.redirect('/userProfile');
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      status: 'fail',
      message: 'Unable to update profile.'
    });
  }
};

// Xóa toàn bộ ProfileUser theo user_id
const deleteProfileUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Tìm và xóa ProfileUser theo user_id
    const deletedProfileUser = await ProfileUser.findOneAndDelete({ user_id });

    if (!deletedProfileUser) {
      return res.status(404).json({
        status: 'fail',
        message: 'ProfileUser not found!'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'ProfileUser deleted successfully.'
    });
  } catch (error) {
    console.error('Error deleting ProfileUser:', error);
    res.status(500).json({
      status: 'fail',
      message: 'Unable to delete ProfileUser.'
    });
  }
};

// Xóa các trường cụ thể trong ProfileUser theo user_id
const deleteProfileUserFields = async (req, res) => {
  try {
    const { user_id } = req.params;
    const fieldsToDelete = req.body; // Các trường cần xóa được gửi từ body của yêu cầu

    const update = {};
    for (const field of Object.keys(fieldsToDelete)) {
      update[field] = ""; // Đặt giá trị của các trường cần xóa thành undefined
    }

    const updatedProfileUser = await ProfileUser.findOneAndUpdate(
      { user_id },
      { $unset: update },
      { new: true }
    );

    if (!updatedProfileUser) {
      return res.status(404).json({
        status: 'fail',
        message: 'ProfileUser not found!'
      });
    }

    res.status(200).json({
      status: 'success',
      data: updatedProfileUser
    });
  } catch (error) {
    console.error('Error deleting ProfileUser fields:', error);
    res.status(500).json({
      status: 'fail',
      message: 'Unable to delete ProfileUser fields.'
    });
  }
};

// Get name, password user by user_id
const getAccUserByUserId = async (req, res) => {
  try {
      const { user_id } = req.params;
      const user = await Users.findOne({ user_id });

      if (!user) {
          return res.status(404).json({
              status: 'fail',
              message: 'User not found!'
          });
      }

      res.status(200).json({
          status: 'success',
          data: {
              username: user.username,
              password: user.password,
              email: user.email
          }
      });
  } catch (error) {
      console.error('Error fetching account details by user_id:', error);
      res.status(500).json({
          status: 'fail',
          message: 'Unable to fetch account details.'
      });
  }
};

const createUser = async (req, res) => {
  try {
      const { username, password, email } = req.body;

      // Check if a user with the same user_id already exists
      let lastUser = await Users.find().sort({ user_id: -1 }).limit(1);
      let newUserId;

      if (lastUser.length > 0) {
          // Increment user_id from the last user's user_id
          newUserId = (parseInt(lastUser[0].user_id, 10) + 1).toString().padStart(2, '0');
      } else {
          // If no users exist, start with '01'
          newUserId = '01';
      }

      // Create a new user with the new user_id
      const newUser = await Users.create({
          user_id: newUserId,
          username,
          password,
          email
      });

      res.status(201).json({
          status: 'success',
          data: {
              user: newUser
          }
      });
  } catch (error) {
      console.error('Error creating new user:', error);
      res.status(400).json({
          status: 'fail',
          message: 'Invalid data sent!'
      });
  }
};

// Update a specific user by user_id
const updateUserByUserId = async (req, res) => {
  try {
      const { user_id } = req.params;
      const { profile } = req.body; // Chỉ cho phép cập nhật profile và các thuộc tính khác ngoài username, password, email

      // Tìm và cập nhật người dùng theo user_id
      const updatedUser = await Users.findOneAndUpdate(
          {user_id},
          { profile },  // Cập nhật profile và các trường khác ngoài username, password, email
          { new: true, runValidators: true }  // `new: true` để trả về document đã được cập nhật
      );

      if (!updatedUser) {
          return res.status(404).json({
              status: 'fail',
              message: 'User not found!'
          });
      }

      res.status(200).json({
          status: 'success',
          data: {
              user: updatedUser
          }
      });
  } catch (error) {
      console.error('Error updating user by user_id:', error);
      res.status(500).json({
          status: 'fail',
          message: 'Unable to update user details.'
      });
  }
};

// update user
const updateUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { username, password, email } = req.body;

    // Tạo một đối tượng chứa các thuộc tính cần cập nhật
    const updateFields = {};

    if (username) {
      updateFields.username = username;
    }
    if (password) {
      updateFields.password = password;
    }
    if (email) {
      updateFields.email = email;
    }

    // Tìm và cập nhật người dùng theo user_id
    const updatedUser = await Users.findOneAndUpdate(
      { user_id },
      { $set: updateFields },  // Cập nhật các trường
      { new: true, runValidators: true }  // `new: true` để trả về document đã được cập nhật
    );

    if (!updatedUser) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found!'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    console.error('Error updating user by user_id:', error);
    res.status(500).json({
      status: 'fail',
      message: 'Unable to update user details.'
    });
  }
};

// Xóa người dùng theo user_id
const deleteUserByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Tìm và xóa người dùng theo user_id
    const deletedUser = await Users.findOneAndDelete({ user_id });

    if (!deletedUser) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found!'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        message: "xoá oke"
      }
    });
  } catch (error) {
    console.error('Error deleting user by user_id:', error);
    res.status(500).json({
      status: 'fail',
      message: 'Unable to delete user.'
    });
  }
};
module.exports = {
    getProfileUserByUserId,
    createProfileUser,
    updateProfileUser,
    deleteProfileUser,
    deleteProfileUserFields,
    getAccUserByUserId,
    createUser,
    updateUser,
    updateUserByUserId,
    deleteUserByUserId
};