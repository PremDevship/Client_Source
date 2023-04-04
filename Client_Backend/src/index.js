const express = require('express')
var cors = require('cors')
const { Router } = require('express')
const mongoose = require('mongoose')
const routeuser = require('./routes/user')
const app = express()

let database = 'mongodb://localhost:27017/Users';

mongoose.connect(database)

const db = mongoose.connection;

db.on('error', (error) => {
    console.log(error);
})

db.once('connected', () => {
    console.log('database connected');
})

//size problem resolved method
app.use(express.json({limit:'50mb'}))

app.use(cors())

app.use('/api/user', routeuser)

// var bodyParser = require('body-parser');
// app.use(
//   bodyParser.json({
//     limit: '50mb',
//   })
// );

// app.use(
//   bodyParser.urlencoded({
//     limit: '50mb',
//     parameterLimit: 100000,
//     extended: true,
//   })
// );



app.listen(3006, () => {
    console.log(`server running at ${3006}`);
})