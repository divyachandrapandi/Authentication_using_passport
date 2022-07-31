require('dotenv').config(); // ENVIRONMENT VARIABLE
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require('express-session');
const passport =require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

// const bcrypt = require('bcrypt'); // FOR LEVEL -4 SALTING 
// const saltRounds = 10;
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

// -----------------------------SECRET KEY FOR ENCRYPTION ---------------------------------//

const secret = process.env.SECRET_KEY; 

// -----------------------------SESSION CONFIGURATION ie express-session ---------------------------------// LEVEL -5 

app.use(session({
    secret: secret,
    resave: false,  //NO NEED RESAVE SESSION VARIABLES IF NOTHING IS CHANGED
    saveUninitialized: false, // NO NEED TO SAVE EMPTY VALUE IN SESSION
}));

// -----------------------------TO USE PASSPORT WITH EXPRESS--------------------------------// LEVEL -5 

app.use(passport.initialize());

// --------------------------------------TO SETUP SESSION WITH PASSPORT --------------------------------// LEVEL -5 

app.use(passport.session());

// -----------------------------CONNECT TO DB ---------------------------------//

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser :true});

// -----------------------------CREATE TO SCHEMA---------------------------------//

const userSchema = new mongoose.Schema({
    email:String,
    password:String
});

// -----------------------------PLUGIN TO SCHEMA LEVEL -5---------------------------------//

userSchema.plugin(passportLocalMongoose);       

// -----------------------------SECRET KEY FOR ENCRYPTION ---------------------------------//

// const secret = process.env.SECRET_KEY;

// -----------------------------PLUGIN TO SCHEMA LEVEL -2 ---------------------------------//

// userSchema.plugin(encrypt, {secret : secret, encryptedFields : ['password']});

// -----------------------------CREATE A MODEL---------------------------------//

const User = mongoose.model('User', userSchema);

// ------------------------LOCAL STRATEGY TO AUTHENTICATE USER -----------------------//

passport.use(User.createStrategy());  //PASSPORT-LOCAL IS STRATEGY TO AUTHENTICATE BY MECHANISM

// ------------------------------TO MAINTAIN LOGIN-SESSION------------------------------//

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// -----------------------------HOME ROUTE ---------------------------------//

app.get("/", function(req,res){
    res.render('home');
});

// ----------------------------- GET LOGIN ROUTE ---------------------------------//

app.get("/login", function(req,res){
    res.render('login');
});

// -----------------------------POST LOGIN ROUTE  ---------------------------------//
app.post("/login", function(req,res){

    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, function(err){
        if (err){
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/secrets");
            })
        }
    })
});

// -----------------------------GET LOGOUT ROUTE---------------------------------//

app.get("/logout", function(req, res){

    req.logout(function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect("/");
        }
    });
});


// ----------------------------- GET SECRETS ROUTE ---------------------------------//

app.get("/secrets", function(req, res){
    res.set("Cache-control", 'no-cache,private, no-store, must-validate, max-stale=0, post-check=0' );
    if (req.isAuthenticated()){
        res.render("secrets");
    } else {
        res.redirect("/login");
    }
});

// ----------------------------- GET REGISTER ROUTE ---------------------------------//

app.get("/register", function(req,res){
    res.render('register');
});

// -----------------------------POST REGISTER ROUTE ---------------------------------//

app.post("/register", function(req,res){

    User.register({username: req.body.username}, req.body.password, function(err, user){
        if (err){
            console.log(err);
            res.redirect("/register")
        } else {
            passport.authenticate("local")(req,res, function(){
                res.redirect("/secrets");
            })
        }
    })
});



// -----------------------------SERVER LISTENING---------------------------------//

app.listen(5000, function(){
    console.log("Server running on port 5000");
});

// ---------------------------------POST LOGIN FOR LEVEL 1 TO 4 ---------------------------//
// app.post("/login", function(req,res){
//     const username = req.body.username;
//     const password = req.body.password;
//     // const password = md5(req.body.password);  
    
//     User.findOne({email:username}, function(err, foundUser){
//         if (err){
//             console.log(err);
//         } else {
//             if (foundUser) {
//                 bcrypt.compare(password, foundUser.password, function(err, result) {
//                     if (result === true){
//                         res.render("secrets");
//                     }                    
//                 });
//             }
//         }
//     });
// });

// app.post("/register", function(req,res){

//     bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
//         const newUser = new User ({
//             email:req.body.username,
//             password: hash
//         });
//         // console.log(newUser.password)
//         newUser.save(function(err){
//             if(!err){
//                 res.render("secrets")
//             } else {
//                 console.log(err);
//             }
//         });
//     });    
// });
//      LEVEL- 3 HASH USE password: md5(req.body.password)