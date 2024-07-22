const Category = require('../app/models/categoriesModel')

const fetchCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().select('name slug');
    res.locals.categories = categories;
    next();
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      status: 'fail',
      message: 'Unable to fetch categories.'
    });
  }
};

  module.exports = fetchCategories;