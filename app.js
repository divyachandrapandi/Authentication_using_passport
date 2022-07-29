require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require ('mongoose-encryption');

// -----------------------------EXPRESS SETUP ---------------------------------//

const app = express();



// -----------------------------STATIC SETUP ---------------------------------//

app.use(express.static("public"));

// -----------------------------EJS SETUP ---------------------------------//

app.set('view engine', 'ejs');

// -----------------------------BODY-PARSER SETUP ---------------------------------//

app.use(bodyParser.urlencoded({extended:true}))


mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser :true});


const userSchema = new mongoose.Schema({
    email:String,
    password:String
});

const secret = process.env.SECRET_KEY;

userSchema.plugin(encrypt, {secret : secret, encryptedFields: ['password']});

const User = mongoose.model('User', userSchema);
// -----------------------------HOME ROUTE ---------------------------------//

app.get("/", function(req,res){
    res.render('home');
});

// -----------------------------LOGIN ROUTE ---------------------------------//

app.get("/login", function(req,res){
    res.render('login');
});

// -----------------------------POST LOGIN ROUTE ---------------------------------//
app.post("/login", function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    
    User.findOne({email:username}, function(err, foundUser){
        if (err){
            console.log(err);
        } else {
            if (foundUser) {
                if (foundUser.password === password){
                    res.render("secrets");
                }
            }
        }
    });
});

// -----------------------------REGISTER ROUTE ---------------------------------//

app.get("/register", function(req,res){
    res.render('register');
});

// -----------------------------POST REGISTER ROUTE ---------------------------------//

app.post("/register", function(req,res){

    const newUser = new User ({
        email:req.body.username,
        password:req.body.password
    });

    newUser.save(function(err){
        if(!err){
            res.render("secrets")
        } else {
            console.log(err);
        }
    });
})
// -----------------------------SERVER LISTENING---------------------------------//

app.listen(5000, function(){
    console.log("Server running on port 5000");
});