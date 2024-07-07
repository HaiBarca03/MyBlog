const express = require('express')
const mongoose = require('mongoose')
const postsRouter = require('../src/router/postsRouter')
const categoryRouter = require('../src/router/categoriesRouter')
const contactRouter = require('../src/router/contactRouter')
const userRouter = require('../src/router/userRouter')
const app = express()

app.use(express.json());

app.use('/', postsRouter)
app.use('/', categoryRouter)
app.use('/', contactRouter)
app.use('/', userRouter)

module.exports = app
