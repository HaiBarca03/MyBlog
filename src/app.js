const express = require('express')
const mongoose = require('mongoose')
const { engine } = require('express-handlebars');
const path = require('path');
const cookieParser = require('cookie-parser');
const fetchCategories = require('./middleware/fetchCategories');
const authenticate = require('./middleware/authMiddleware');
const postsRouter = require('../src/router/postsRouter')
const categoryRouter = require('../src/router/categoriesRouter')
const contactRouter = require('../src/router/contactRouter')
const userRouter = require('../src/router/userRouter')
const homeRouter = require('../src/router/homeRouter');
const authRoutes = require('../src/router/authRouter');

const app = express()

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(express.json());
app.engine('.hbs', engine({
  layoutsDir: path.join(__dirname, 'resources/views/layouts'), // Đường dẫn tới layouts
  defaultLayout: 'main', // Tên file layout chính
  extname: '.hbs', // Phần mở rộng của file template
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  },
  helpers: {
    eq: function (a, b) {
      return a === b;
    }
  }
}));

app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'resources/views'));

app.use(fetchCategories);
// app.use(setUserId);
// app.use(authMiddleware);

app.use('/', homeRouter);
app.use('/', postsRouter)
app.use('/', categoryRouter)
app.use('/', contactRouter)
app.use('/', userRouter)
app.use('/', authRoutes)

module.exports = app
