const Users = require('../app/models/userModel');

const adminAuth = async (req, res, next) => {
    try {
        const user_id = req.user ? req.user.user_id : null;

        if (!user_id) {
            return res.status(403).json({
                status: 'fail',
                message: 'Access denied! Please log in.'
            });
        }

        if (user_id !== '01') { // Check if the user is not admin
            return res.status(403).json({
                status: 'fail',
                message: 'Access denied! Admins only.'
            });
        }

        next();
    } catch (error) {
        console.error('Authorization error:', error);
        res.status(500).json({
            status: 'fail',
            message: 'An error occurred while checking permissions.'
        });
    }
};

module.exports = adminAuth;
