// middleware/setUserId.js
const setUserId = (req, res, next) => {
  // Assuming you have a way to get the current user_id, e.g., from session
  // const user_id = "01"; // Replace with actual logic to get the current user_id
  // const user_id;
  res.locals.user_id = user_id;
  next();
};

module.exports = setUserId;