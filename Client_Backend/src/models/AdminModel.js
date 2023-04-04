const mongoose = require('mongoose')

const AdminInfo = new mongoose.Schema({
    id:{
        type: String,
        required: true
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
    }
})

module.exports = mongoose.model('AdminCredentials',AdminInfo)