const express = require('express')
const Category = require('../app/models/categoriesModel')
const fetchCategories = require('../middleware/fetchCategories')
const { getCategories, getPostsByCategorySlug, createCategory, updateCategoryById, deleteCategoryById } = require('../app/controllers/categoriesController')
const router = express.Router()

router.get('/categories', getCategories)
router.get('/category/:slug', getPostsByCategorySlug);
router.post('/categories', createCategory);
router.patch('/categories/:categoryId', updateCategoryById);
router.delete('/categories/:categoryId', deleteCategoryById);

module.exports = router