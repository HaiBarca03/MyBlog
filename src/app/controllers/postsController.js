const Posts = require('../models/postsModel')   

// get all post
const getPosts = async (req, res) => {
    console.log('getPosts called'); // Logging to debug
    try {
        const posts = await Posts.find({});
        res.status(200).json({
            status: 'success',
            result: posts.length,
            data: {
                posts
            }
        });
    } catch (err) {
        console.log('Error:', err.message); // Logging to debug errors
        res.status(400).json({
            status: 'fail',
            message: 'Invalid data sent!'
        });
    }
};
// get post by slug
const getPostsBySlug = async (req, res) => {
    console.log('getPostsBySlug called'); // Logging to debug
    try {
        const { slug } = req.params; // Lấy slug từ tham số của yêu cầu
        const posts = await Posts.find({ slug }); // Tìm các bài viết theo slug

        if (posts.length === 0) {
            return res.status(404).json({
                status: 'fail',
                message: 'No posts found with the given slug!'
            });
        }

        res.status(200).json({
            status: 'success',
            result: posts.length,
            data: {
                posts
            }
        });
    } catch (err) {
        console.log('Error:', err.message); // Logging to debug errors
        res.status(400).json({
            status: 'fail',
            message: 'Invalid data sent!'
        });
    }
};

// Create a new post
const createPost = async (req, res) => {
    console.log('createPost called'); // Logging to debug
    try {
        const newPost = await Posts.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                post: newPost
            }
        });
    } catch (err) {
        console.log('Error:', err.message); // Logging to debug errors
        res.status(400).json({
            status: 'fail',
            message: 'Invalid data sent!'
        });
    }
};

// Update an existing post
const updatePost = async (req, res) => {
    try {
        const { id } = req.params; // Lấy id của bài post từ URL params
        const updatedPost = await Posts.findByIdAndUpdate(id, req.body, {
            new: true, // Trả về bài post đã được cập nhật
            runValidators: true // Chạy các validator đã định nghĩa trong schema
        });

        if (!updatedPost) {
            return res.status(404).json({
                status: 'fail',
                message: 'Post not found!'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                post: updatedPost
            }
        });
    } catch (err) {
        console.log('Error:', err.message); // Logging to debug errors
        res.status(400).json({
            status: 'fail',
            message: 'Invalid data sent!'
        });
    }
};

// Delete a post by id
const deletePost = async (req, res) => {
    try {
        const { id } = req.params; // Lấy id của bài post từ URL params
        const deletedPost = await Posts.findByIdAndDelete(id);

        if (!deletedPost) {
            return res.status(404).json({
                status: 'fail',
                message: 'Post not found!'
            });
        }

        res.status(204).json({
            status: 'success',
            message: 'Post deleted successfully!'
        });
    } catch (err) {
        console.log('Error:', err.message); // Logging to debug errors
        res.status(400).json({
            status: 'fail',
            message: 'Invalid data sent!'
        });
    }
};

module.exports = {
    getPosts,
    getPostsBySlug,
    createPost,
    updatePost,
    deletePost
}