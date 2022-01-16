const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    nick: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    bio: {
        type: String
    },
    admin: {
        type: Number,
        default: 0
    },
    googleId: {
        type: String
    },
    facebookId: {
        type: String
    },
    likeCount:  {
        type: Number,
        default: 0
    },
    viewCount:  {
        type: Number,
        default: 0
    },
    profilePic: {
        type: String
    },
    tokens: [{
        token: {
            type: String,
            required: true
        },
        machine:{
            type: String,
            trim: true
        },
        os:{
            type: String,
            trim: true
        },
        ip:{
            type: String,
        }
    }]
},{
    timestamps: true
})


const User = mongoose.model('User', userSchema)

module.exports = User
