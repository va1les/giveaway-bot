const mongoose = require('mongoose');

const schema = mongoose.Schema({
    gid: String,
})

module.exports = mongoose.model('guild', schema);