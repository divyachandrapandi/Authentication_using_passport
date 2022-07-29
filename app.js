const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');


// -----------------------------EXPRESS SETUP ---------------------------------//

const app = express();

// -----------------------------STATIC SETUP ---------------------------------//

app.use(express.static("public"));

// -----------------------------EJS SETUP ---------------------------------//

app.set('view engine', 'ejs');

// -----------------------------BODY-PARSER SETUP ---------------------------------//

app.use(bodyParser.urlencoded({extended:true}))


// -----------------------------SERVER LISTENING---------------------------------//

app.listen(5000, function(){
    console.log("Server running on port 5000");
});