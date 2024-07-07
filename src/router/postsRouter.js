const express = require('express')
const Posts = require('../app/models/postsModel')
const {getPosts, getPostsBySlug, createPost, updatePost, deletePost} = require('../app/controllers/postsController')
const router = express.Router()

router.get('/posts', getPosts)
router.get('/posts/:slug', getPostsBySlug)
router.post('/posts', createPost);
router.put('/posts/:id', updatePost);
router.delete('/posts/:id', deletePost);

module.exports = router