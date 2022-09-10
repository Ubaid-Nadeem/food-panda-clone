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

let arry = []

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


const DishesSchema = new mongoose.Schema({
    DishName: String,
    Discription: String,
    Price: Number,
    Delivery: String,
    Location: String,
    Rating: Number,
    Duration: String
});

const ShopSchema = new mongoose.Schema({
    City: String,
    Dishes: [DishesSchema],
    ShopName: String,
    Thumbnail: String
});

const dishSchema = new mongoose.Schema({
    DishName: String,
    Discription: String,
    Price: Number,
    Delivery: String,
    Location: String,
    Rating: Number,
    Duration: String,
    Author: { type: mongoose.Schema.Types.ObjectId, ref: "shops" }
});


const Users = mongoose.model('users', schema);
const Shop = mongoose.model('shops', ShopSchema);
const Dish = mongoose.model('dishes', dishSchema)

app.post('/checkEmail', (req, res) => {

    Users.find({ email: req.body.email }, ((err, data) => {
        res.send(data)
    }))
})

app.post('/reviewpassword', (req, res) => {

    const password = cryptr.encrypt(req.body.password);

    Users.find({ email: req.body.email }, ((err, data) => {

        const password = cryptr.decrypt(data[0].password)

        if (req.body.password == password) {
            res.send(data)
        }
        else {
            res.send({ error: "invalid Password" })
        }

    }))
})

app.post('/createNewUser', (req, res) => {
    // console.log(req.body)
    const password = cryptr.encrypt(req.body.Password);


    let user = new Users({
        email: req.body.email,
        fisrtName: req.body.firstName,
        lastName: req.body.lastName,
        password: password
    })
    user.save((err, data) => {
        console.log(err)
    })

    res.send({
        message: "Account has been created"
    })
});

app.post('/getuser', (req, res) => {

    Users.find(req.body, (error, result) => {
        res.send(result)
    })
})

app.post('/getshops', (req, res) => {
    console.log(req.body)

    // let AddDish = new Dish({
    //     ShopName: req.body.ShopName,
    //     city: req.body.city,
    //     Dish: req.body.Dishes,
    //     author: req.body.id
    // })

    // AddDish.save((err, data) => {
    //     console.log(data)
    //     res.send(data)
    // })

    // let newShop = new Shop({
    //     City: req.body.City,
    //     Dishes: [req.body.Dishes],
    //     ShopName: req.body.ShopName,
    //     Thumbnail: req.body.Thumbnail

    // })
    // newShop.save((rer, data) => {
    //     console.log(data)
    //     res.send(data)
    // })

    // Dish.find({ Location: req.body.Location }, (eror, data) => {
    //     res.send(data)
    // })
    // console.log(req.body)
    Shop.find({ City : req.body.city }, (err, data) => {
        res.send(data)
    })
})
// app.post('/addDish', (req, res) => {
//     // console.log(req.body)
//     const NewDish = new Dish({
//         DishName: req.body.DishName,
//         Discription: req.body.Discription,
//         Price: req.body.Price,
//         Delivery: req.body.Delivery,
//         Location: req.body.Location,
//         Rating: req.body.Rating,
//         Duration: req.body.Duration,
//         Author: req.body.Autor
//     })
//     NewDish.save((err, data) => {
//         console.log(data)
//     })
//     Dish.find({ Location: "Karachi" }).populate("Author").exec((err, data) => {
//         res.send(data)
//     })


//     Shop.findOne({ _id: "63165baa892abc4b46245fd6" }).update({
//         $push: {
//             Dishes: {
//                 "DishName": req.body.DishName,
//                 "Discription": req.body.Discription,
//                 "Price": req.body.Price,
//                 "Delivery": req.body.Delivery,
//                 "Location": req.body.Location,
//                 "Rating": req.body.Rating,
//                 "Duration": req.body.Duration
//             }
//         }
//     }).exec()


// })
app.listen(process.env.PORT || "400");
