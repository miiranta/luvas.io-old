const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    name: {
        type: String,
        required: true
    },
    url: {
        type: String
    },
    public: {
        type: Boolean,
        required: true
    },
    local: {
        type: Boolean,
        required: true
    },
    auth: {
        type: Boolean,
        required: true
    },
    edited: {
        type: Boolean,
        default: false
    },
    adminlevel: {
        type: Number,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    likeCount:  {
        type: Number,
        default: 0
    },
    viewCount:  {
        type: Number,
        default: 0
    }, 
    picture: {
        type: String,
        required: true
    },
   
},{
    timestamps: true
})


const App = mongoose.model('App', userSchema)

module.exports = App
