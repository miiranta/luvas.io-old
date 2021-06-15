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
    picture: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    }
},{
    timestamps: true
})


const App = mongoose.model('App', userSchema)

module.exports = App
