const mongoose = require('mongoose');
const connectDB = require('./dbconnection');

connectDB();

const userSchema = mongoose.Schema({
    name : String,
    email: String,
    username : String,
    password: String,
})

module.exports = mongoose.model("user", userSchema);
