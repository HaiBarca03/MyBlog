const express = require('express')
const Posts = require('../app/models/postsModel')
const { adminAuth, authenticate} = require('../middleware/authMiddleware');
const {
    getPosts, 
    getPostsBySlug,
    getPostById, 
    createPost, 
    updatePost, 
    deletePost, 
    postComment,
    getUserCmt,
    editComment,
    deleteComment,
    like
} = require('../app/controllers/postsController')

const router = express.Router()

router.get('/managePosts', authenticate, getPosts);
router.post('/api/posts', authenticate, adminAuth, createPost);
router.get('/post/:slug', getPostsBySlug)
router.delete('/posts/delete/:id', authenticate, adminAuth, deletePost);
router.get('/posts/edit/:id', authenticate, adminAuth, getPostById)
router.put('/posts/edit/:id', authenticate, adminAuth, updatePost)
// router.put('/edit/:id', authenticate, adminAuth, updatePost);
router.post('/comments', authenticate, postComment)
router.get('/posts/:id', authenticate, getUserCmt)
router.put('/comment/:id', authenticate, editComment);
router.delete('/comments/:id', authenticate, deleteComment);
router.post('/posts/:id/like', like);

module.exports = router