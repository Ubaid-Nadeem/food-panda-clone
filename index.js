const mongoose = require('mongoose');
const express = require("express");
const cors = require("cors")
const bodyparser = require("body-parser");
const Cryptr = require('cryptr');


const app = express();

app.use(bodyparser.json({ limit: "5000kb" }));
app.use(bodyparser.urlencoded({ extended: true }))
app.use(cors());


process.on('uncaughtException', (error) => {
    console.log(error.stack)
});

const cryptr = new Cryptr('myTotallySecretKey');
let currentUser;
// const decryptedString = cryptr.decrypt("9f1d72bd84a55ed0c2971bdcb3370ea6ea04c120ce7b1991ad3b7659eb6614e0fcf9ab13574510c1eb27bb8aa4169d9733aa35e31a06c02f5312a6a7b7037573db19db1964cc6e4e6a644b6c04388b30b6310cd20a311f31c3b1576aa4d5350f207e4faab68af01e");


mongoose.connect('mongodb+srv://ubaidnadeem:ubaid12345@testdb.pnswp.mongodb.net/NEW_DB?retryWrites=true&w=majority');
let db = mongoose.connection;
db.on('error', function (error) {
    console.log(error)
})
db.on('open', function () {
    console.log('Connected to MOngoDB');
});

const schema = new mongoose.Schema({
    email: 'string',
    fisrtName: 'string',
    lastName: 'string',
    password: 'string'
});
const Users = mongoose.model('users', schema);

app.post('/checkEmail', (req, res) => {

    Users.find({ email: req.body.email }, ((err, data) => {
        res.send(data)
    }))
})

app.post('/reviewpassword', (req, res) => {

    const password = cryptr.encrypt(req.body.password);

    Users.find({ email: req.body.email }, ((err, data) => {

        const password = cryptr.decrypt(data[0].password)
        console.log(password)
        if (req.body.password == password) {
            res.send(data)
        }
        else {
            res.send({ error: "invalid Password" })
        }

    }))
})

app.post('/createNewUser', (req, res) => {
    console.log(req.body)
    const password = cryptr.encrypt(req.body.Password);


    let user = new Users({
        email: req.body.email,
        fisrtName: req.body.firstName,
        lastName: req.body.lastName,
        password: password
    })
    user.save((err) => {
        console.log(err)
    })

    res.send({
        message: "Account has been created"
    })
});

app.listen(process.env.PORT || "400");