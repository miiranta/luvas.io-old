const mongoose = require('mongoose')

const likeSchema = new mongoose.Schema({
    postId: {
        type: String,
        required: true
    },
    likeOwner: {
        type: String,
        required: true
    }
},{
    timestamps: true
})


const Like = mongoose.model('Like', likeSchema)

module.exports = Like