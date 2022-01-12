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
    profilePic: {
        type: String
    },
    bio: {
        type: String
    },
    admin: {
        type: Number
    },
    googleId: {
        type: String
    },
    facebookId: {
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
