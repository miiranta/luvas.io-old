const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    owner: {
        type: String,
        required: true
    },
    post: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
},{
    timestamps: true
})


const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment