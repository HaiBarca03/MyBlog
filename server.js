require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const { engine } = require('express-handlebars');
const path = require('path');
const app = require('./src/app')
const PORT = process.env.PORT || 3000
const DATABASE_USERNAME = process.env.DATABASE_USERNAME;
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
const DATABASE_HOST = process.env.DATABASE_HOST;
const DATABASE_NAME = process.env.DATABASE_NAME;
const DATABASE = `mongodb+srv://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${DATABASE_HOST}/${DATABASE_NAME}?retryWrites=true&w=majority&appName=MyPersonalBlog`;

// connect db
mongoose.connect(DATABASE)
    .then(() => console.log('Database connected successfully'))
    .catch((error) => { console.log(error) })

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`)
})