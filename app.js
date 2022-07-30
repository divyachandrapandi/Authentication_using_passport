require('dotenv').config(); // ENVIRONMENT VARIABLE
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // FOR LEVEL -4 SALTING 
const saltRounds = 10;
// const md5 = require('md5');  // FOR LEVEL-3 HASHING
// const encrypt = require ('mongoose-encryption');  // FOR LEVEL 2 ENCRYPTION

// -----------------------------EXPRESS SETUP ---------------------------------//

const app = express();

// -----------------------------STATIC SETUP ---------------------------------//

app.use(express.static("public"));

// -----------------------------EJS SETUP ---------------------------------//

app.set('view engine', 'ejs');

// -----------------------------BODY-PARSER SETUP ---------------------------------//

app.use(bodyParser.urlencoded({extended:true}));

// -----------------------------CONNECT TO DB ---------------------------------//

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser :true});

// -----------------------------CREATE TO SCHEMA---------------------------------//

const userSchema = new mongoose.Schema({
    email:String,
    password:String
});

// -----------------------------SECRET KEY FOR ENCRYPTION ---------------------------------//

const secret = process.env.SECRET_KEY;

// -----------------------------PLUGIN TO SCHEMA LEVEL -2 ---------------------------------//

// userSchema.plugin(encrypt, {secret : secret, encryptedFields : ['password']});

// -----------------------------PLUGIN TO SCHEMA ---------------------------------//

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
    // const password = md5(req.body.password);  
    
    User.findOne({email:username}, function(err, foundUser){
        if (err){
            console.log(err);
        } else {
            if (foundUser) {
                bcrypt.compare(password, foundUser.password, function(err, result) {
                    if (result === true){
                        res.render("secrets");
                    }                    
                });
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

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User ({
            email:req.body.username,
            password: hash
        });
        // console.log(newUser.password)
        newUser.save(function(err){
            if(!err){
                res.render("secrets")
            } else {
                console.log(err);
            }
        });
    });    
});
//      LEVEL- 3 HASH USE password: md5(req.body.password)
// -----------------------------SERVER LISTENING---------------------------------//

app.listen(5000, function(){
    console.log("Server running on port 5000");
});

