const mongoose = require('mongoose');

const schema = mongoose.Schema({
    description: String,
    prize: String,
    duration: Number,
    duration_end: Number,
    winners: Number,
    hosted: String,
    members: Array,
    gid: String,
    channel: String,
    message: String,
    end: Boolean
})

module.exports = mongoose.model('giveaways', schema);