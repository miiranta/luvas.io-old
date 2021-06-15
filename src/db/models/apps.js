const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
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
    authRequired: {
        type: Boolean,
        required: true
    },
    picture: {
        type: String
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
