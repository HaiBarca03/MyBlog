const mongoose = require('mongoose');
const Posts = require('../models/postsModel');
const Category = require('../models/categoriesModel');

// get all posts cate
const getCategories = async (req, res) => {
  try {
    // Attempt to find an existing category
    const existingCategory = await Category.findOne({}); 

    if (existingCategory) {
      // Category already exists, populate posts and return
      const categories = await Category.find({}).populate('posts');
      res.status(200).json({
        status: 'success',
        result: categories.length,
        data: {
          categories
        }
      });
    } else {
      // No category exists, create a new one (you'll need to define the category data)
      const newCategory = new Category({
        description: 'Your category description', // Replace with actual data
        name: 'Your category name',              // Replace with actual data
        slug: 'your-category-slug',             // Replace with actual data
        user_id: 'user_id'                       // Replace with actual data
      });

      // Save the new category
      await newCategory.save();

      // Return the newly created category
      res.status(201).json({
        status: 'success',
        result: 1,
        data: {
          category: newCategory
        }
      });
    }
  } catch (err) {
    console.error('Error fetching categories:', err); 
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!'
    });
  }
};

// get posts by category slug
const getPostsByCategorySlug = async (req, res) => {
  try {
    // Get slug from request parameters
    const { slug } = req.params;

    // Find category by slug and populate posts
    const category = await Category.findOne({ slug }).populate('posts');

    // Check if category found
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Extract posts from category
    const posts = category.posts;

    // Send response with posts
    res.status(200).json({ posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create a new category
const createCategory = async (req, res) => {
  try {
      const { description, name, slug, user_id } = req.body;

      // Create the category without posts
      const newCategory = await Category.create({
          description,
          name,
          slug,
          user_id,
          posts: [] // Initialize with an empty array
      });

      res.status(201).json({
          status: 'success',
          data: {
              category: newCategory
          }
      });
  } catch (err) {
      console.error('Error:', err.message); // Logging to debug errors
      res.status(400).json({
          status: 'fail',
          message: 'Invalid data sent!'
      });
  }
};

// Update category by ID
const updateCategoryById = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const updateData = req.body;

    // Tìm và cập nhật danh mục theo ID
    const category = await Category.findByIdAndUpdate(categoryId, updateData, {
      new: true,
      runValidators: true
    });

    if (!category) {
      return res.status(404).json({
        status: 'fail',
        message: 'Category not found!'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        category
      }
    });
  } catch (err) {
    console.error('Error updating category:', err);
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!'
    });
  }
};

// Delete category by ID
const deleteCategoryById = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Tìm và xóa danh mục theo ID
    const category = await Category.findByIdAndDelete(categoryId);

    if (!category) {
      return res.status(404).json({
        status: 'fail',
        message: 'Category not found!'
      });
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    console.error('Error deleting category:', err);
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!'
    });
  }
};

module.exports = {
  getCategories,
  createCategory,
  getPostsByCategorySlug,
  updateCategoryById,
  deleteCategoryById
};