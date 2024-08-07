const Category = require('../app/models/categoriesModel')

const fetchCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().select('name slug');
    res.locals.categories = categories;
    next();
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.locals.categories = [];
    next(); // Proceed even if there's an error
  }
};

module.exports = fetchCategories;