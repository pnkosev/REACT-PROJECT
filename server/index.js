const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');

const env = process.env.NODE_ENV || 'development';
const config = require('./config/config')[env];

require('./database/database')(config);

const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/user', authRoutes);
app.use('/post', postRoutes);
app.use('/comment', commentRoutes);

// General error handling
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
  next();
})

app.listen(config.port, () => { console.log(`REST API listening on port: ${config.port}`) });