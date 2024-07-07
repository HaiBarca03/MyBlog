require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const app = require('./src/app')
const PORT = process.env.PORT || 3000
const DATABASE_USERNAME = process.env.DATABASE_USERNAME;
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
const DATABASE_HOST = process.env.DATABASE_HOST;
const DATABASE_NAME = process.env.DATABASE_NAME;
const DATABASE = `mongodb+srv://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${DATABASE_HOST}/${DATABASE_NAME}?retryWrites=true&w=majority&appName=MyPersonalBlog`;
const DATABASE_LOCAL = process.env.DATABASE_LOCAL

// connect db
mongoose.connect(DATABASE)
// mongoose.connect(DATABASE_LOCAL)
.then(() => console.log('Database connected successfully'))
.catch((error) => {console.log(error)})

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`)
})