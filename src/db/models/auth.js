const mongoose = require('mongoose')

const authSchema = new mongoose.Schema({
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

    tokens: [{
        token: {
            type: String,
            required: true
        },
        browser:{
            type: String
        }
    }]
},{
    timestamps: true
})


const Auth = mongoose.model('Auth', authSchema)

module.exports = Auth
