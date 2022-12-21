const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    gid: String,
    uid: String,
})
module.exports = mongoose.model('user', userSchema);