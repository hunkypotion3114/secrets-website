//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

mongoose.connect("mongodb://localhost:27017/userDB", {
    useNewUrlParser: true
});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, {secret: process.env.SECRET , encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.listen(3000, () => {
    console.log("Death Star ready at port 3000");
});

app.get("/", (req, res) => {
    res.render("home");
});

app.route("/login")
    .get((req, res) => {
        res.render("login");
    })
    .post((req, res) => {
        const username = req.body.username;
        const password = req.body.password;

        User.findOne({email: username}, (err, result) => {
            if (!err) {
                if (result) {
                    if (result.password === password) {
                        res.render("secrets");
                    } else {
                        res.send("try again");
                    }
                } else {
                    res.send("Email does not match maybe try registering instead??");
                }
            }
            else{
                console.log(err);
            }
        });
    })
;

app.route("/register")
    .get((req, res) => {
        res.render("register");
    })
    .post((req, res) => {
        const newUser = new User({
            email: req.body.username,
            password: req.body.password
        });
        newUser.save((err) => {
            if (!err) {
                res.render("secrets");
            } else {
                console.log(err);
            }
        });
    })
;