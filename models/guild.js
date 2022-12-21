const mongoose = require('mongoose');

const schema = mongoose.Schema({
    gid: String,
    emoji: String,
    color: String, // /^#[0-9A-F]{6}$/i?
})

module.exports = mongoose.model('guild', schema);