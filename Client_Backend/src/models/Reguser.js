const mongoose = require('mongoose')

const user = new mongoose.Schema({
    id:{
        type: String,
        required: true
    },
    Firstname: {
        type: String,
        required: true,
    },
    role: {
        type: Number,
        required: true
    },
    AdminAccess: {
        type: Boolean,
        required: true,
        default: false
    },
    SuperAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    Lastname: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true,
    },
    Password: {
        type: String,
        required: true,
    },
    Token: {
        type: String,
        required: true,
    },
    modifiedby: {
        type: String,
        required: false,
    },
    Status: {
        type: Number,
        required: true,
        default: 0,
    }
})

module.exports = mongoose.model('userinfo',user)