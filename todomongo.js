// todomongo.js
const mongoose = require('mongoose');

const atlasConnectionString = "mongodb+srv://adityasingh_db_user:aadi%40123%40@cluster2.oe8bykd.mongodb.net/ToDoDB?retryWrites=true&w=majority&appName=Cluster2";
mongoose.connect(atlasConnectionString)
  .then(() => console.log('MongoDB Atlas connected'))
  .catch(err => console.log('MongoDB Atlas connection error:', err));

module.exports = mongoose;


