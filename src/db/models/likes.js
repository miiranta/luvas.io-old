const mongoose = require('mongoose')

const likeSchema = new mongoose.Schema({
    postName: {
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


const Like = mongoose.model('Like', userSchema)

module.exports = Like