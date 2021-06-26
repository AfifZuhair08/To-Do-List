// includes library
const express = require("express");
const bodyParser = require("body-parser");

// initiate express server
const app = express();

// set server settings
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

// global variables
var items = ["Buy Food","Cook Food","Eat Food"];

app.get("/", function(req,res){
    var today = new Date();

    var options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    };
    
    var day = today.toLocaleDateString("en-MY", options);

    res.render("list", {kindOfDay: day, newListItems: items});
});


app.post("/", function(req,res){
    // reassign to global variable
    item = req.body.newItem;

    // push items as array into global variable
    items.push(item);

    // res.render("list", {newListItem: item});
    // redirect to homepage
    res.redirect("/");
});


app.listen(3000, function(){
    console.log("Server started on port 3000");
});