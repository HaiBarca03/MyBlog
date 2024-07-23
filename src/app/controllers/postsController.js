const Posts = require('../models/postsModel');
const Category = require('../models/categoriesModel');
const mongoose = require('mongoose')
const {  adminAuth, authenticate} = require('../../middleware/authMiddleware')

const getHome = async (req, res) => {
  try {
    // Lấy các bài viết mới nhất
    const posts = await Posts.find().sort({ createdAt: -1 }).limit(5); // Giới hạn số lượng bài viết nếu cần
    const noResults = req.query.noResults === 'true';

    // Render trang chủ với danh sách bài viết
    res.render('home', {
      title: 'Home Page',
      posts: posts,
      noResults: noResults
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).send('Server error');
  }
}
const createPost = async (req, res) => {
  try {
    const { author, content, date, featured, slug, tags, title, categories, images, videos } = req.body;
    const isAuthorized = req.user && (req.user.user_id === '01' || req.user.admin === true);
    const user_id = req.user.user_id;

    if (!isAuthorized) {
      console.log('Access denied! Admins only.');
      return res.status(403).json({
        status: 'fail',
        message: 'Access denied! Admins only.'
      });
    }

    const newPost = await Posts.create({
        user_id,
        author,
        content,
        date,
        featured,
        slug,
        tags,
        title,
        categories,
        media: { images, videos }
    });

    if (categories && categories.length > 0) {
        await Category.updateMany(
            { _id: { $in: categories } },
            { $push: { posts: newPost._id } }
        );
    }

    res.redirect('/managePosts');

  } catch (error) {
    console.error('Error creating post:', error);
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!'
    });
  }
};

const getPosts = async (req, res) => {
  try {
    const isAuthorized = req.user && (req.user.user_id === '01' || req.user.admin === true);

    if (!isAuthorized) {
      console.log('Access denied! Admins only.');
      return res.status(403).send('Forbidden');
    }

    const posts = await Posts.find({});
    res.render('managePosts', {
      layout: 'main',
      posts: posts,
      isAuthorized: isAuthorized // Pass this variable to the template
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).send('Server Error');
  }
};


// get post by slug
const getPostsBySlug = async (req, res) => {
    console.log('getPostsBySlug called'); // Logging to debug
    try {
        const { slug } = req.params;
        const post = await Posts.findOne({ slug });
    
        if (!post) {
          return res.status(404).json({ message: 'Post not found' });
        }
    
        console.log(post); // Log the retrieved post data
    
        res.render('postDetail', {
          title: post.title,
          post: post,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
};

const getPostById = async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id);
        if (!post) {
          return res.status(404).json({
            status: 'fail',
            message: 'Post not found'
          });
        }
        res.json(post);
      } catch (error) {
        console.error('Error fetching post:', error);
        res.status(400).json({
          status: 'fail',
          message: 'Error fetching post'
        });
      }
}

const updatePost = async (req, res) => {
  try {
      const postId = req.params.id;
      const { author, title, content, date, featured, slug, tags, categories, images, videos } = req.body;

      // Check if the post exists
      const post = await Posts.findById(postId);
      if (!post) {
          return res.status(404).json({ message: 'Post not found' });
      }

      // Update the post
      post.author = author;
      post.title = title;
      post.content = content;
      post.date = new Date(date);
      post.featured = featured === 'true'; // Convert string to boolean
      post.slug = slug;
      post.tags = tags.split(',').map(tag => tag.trim()); // Split and trim tags
      post.categories = categories; // Assuming categories are passed as array of ids
      post.images = images.split(',').map(image => image.trim()); // Split and trim images
      post.videos = videos.split(',').map(video => video.trim()); // Split and trim videos

      // Save the updated post
      await post.save();

      res.status(200).json({ message: 'Post updated successfully' });
  } catch (error) {
      console.error('Error updating post:', error);
      res.status(500).json({ message: 'Server error' });
  }
};
// Delete a post by id
const deletePost = async (req, res) => {
  try {
      const { id } = req.params;
      const isAuthorized = req.user && (req.user.user_id === '01' || req.user.admin === true);

      if (!isAuthorized) {
          console.log('Access denied! Admins only.');
          return res.status(403).json({
              status: 'fail',
              message: 'Access denied! Admins only.'
          });
      }

      const deletedPost = await Posts.findByIdAndDelete(id);

      if (!deletedPost) {
          return res.status(404).json({
              status: 'fail',
              message: 'Post not found'
          });
      }

      // Optionally, remove the post reference from categories
      await Category.updateMany(
          { posts: id },
          { $pull: { posts: id } }
      );

      res.status(200).json({
          status: 'success',
          message: 'Post deleted successfully'
      });
  } catch (error) {
      console.error('Error deleting post:', error);
      res.status(400).json({
          status: 'fail',
          message: 'Error deleting post'
      });
  }
};

  
const postComment = async (req, res) => {
  try {
    const { postId, content } = req.body;
    const post = await Posts.findById(postId);

    if (!post) {
      return res.status(404).send('Post not found');
    }

    const newComment = {
      author: req.user.username, // Assuming `username` is the field storing user's name
      content,
      date: new Date(),
    };

    post.comments.push(newComment);
    await post.save();

    res.redirect(`/posts/${postId}`);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).send('Server error');
  }
}

const getUserCmt = async (req, res) => {
  try {
    const postId = req.params.id;
    const user = req.user
    const post = await Posts.findById(postId).populate('comments');
    if (!post) {
      return res.status(404).send('Post not found');
    }
    res.render('postDetail', {
      title: post.title,
      post: post,
      user: user
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).send('Server error');
  }
}

const editComment = async (req, res) => {
try {
    const { id } = req.params;
    const { content } = req.body;
    const user = req.user;

    // Find the post and the comment
    const post = await Posts.findOne({ 'comments._id': id });
    if (!post) {
      return res.status(404).send('Post or comment not found');
    }

    const comment = post.comments.id(id);
    if (!comment) {
      return res.status(404).send('Comment not found');
    }

    // Check if the user is authorized to edit the comment
    if (comment.author !== user.username && user.user_id !== '01') { // '01' is admin ID
      return res.status(403).json({ message: 'Forbidden: You do not have permission to edit this comment.' });
    }

    // Update the comment content
    comment.content = content;
    await post.save();

    res.status(200).json({ message: 'Comment updated successfully' });
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;

    // Find the post containing the comment
    const post = await Posts.findOne({ 'comments._id': commentId });
    if (!post) {
      return res.status(404).send('Post or comment not found');
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).send('Comment not found');
    }

    // Check if the user is authorized to delete the comment
    const isAdmin = req.user.user_id === '01'; // Admin ID
    const isOwner = req.user.username === comment.author;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'Forbidden: You do not have permission to delete this comment.' });
    }

    // Remove the comment
    post.comments.pull(commentId);
    await post.save();

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const like = async (req, res) => {
  try {
    const postId = req.params.id; // Lấy ID bài viết từ URL
    const userId = req.user; // Lấy ID người dùng từ req.user nếu đăng nhập

    if (!postId) {
      return res.status(400).send('Invalid post ID');
    }

    // Tìm bài viết theo ID
    const post = await Posts.findById(postId);
    if (!post) {
      return res.status(404).send('Post not found');
    }

    // Kiểm tra xem người dùng đã like bài viết chưa
    const hasLiked = post.likes && post.likes.includes(userId);

    if (hasLiked) {
      // Nếu người dùng đã like bài viết, giảm likeCount và xóa like của người dùng
      post.likeCount = Math.max(post.likeCount - 1, 0); // Giảm likeCount nếu lớn hơn 0
      post.likes = post.likes.filter(id => id.toString() !== userId.toString());
    } else {
      // Nếu người dùng chưa like bài viết, tăng likeCount và thêm like của người dùng
      post.likeCount += 1;
      if (post.likes) {
        post.likes.push(userId);
      } else {
        post.likes = [userId];
      }
    }

    // Lưu bài viết đã cập nhật
    await post.save();

    // Phản hồi với số lượng like đã cập nhật và trạng thái like
    res.status(200).json({
      message: hasLiked ? 'Like removed successfully' : 'Post liked successfully',
      likeCount: post.likeCount,
      liked: !hasLiked
    });
  } catch (error) {
    console.error('Error handling like:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const search = async (req, res) => {
  const searchTerm = req.query.searchTerm || '';
  
  try {
    const posts = await Posts.find({
      $text: { $search: searchTerm }
    }).exec();
    
    if (posts.length > 0) {
      res.render('search', { title: 'Search Results', posts, searchTerm });
    } else {
      res.redirect('/home?noResults=true'); // Redirect to home if no results found
    }
  } catch (err) {
    console.error(err);
    res.redirect('/home'); // Redirect to home on error
  }
};

module.exports = {
    getHome,
    getPosts,
    getPostsBySlug,
    createPost,
    updatePost,
    deletePost,
    getPostById,
    postComment,
    getUserCmt,
    editComment,
    deleteComment,
    like,
    search
}