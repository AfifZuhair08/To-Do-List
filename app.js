// includes library
const express = require("express");
const bodyParser = require("body-parser");

// import js files
const date = require(__dirname + "/date.js");

// initiate express server
const app = express();

// set server settings
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// global letiables
const items = ["Buy Food","Cook Food","Eat Food"];
const workItems = [];

app.get("/", function(req,res){
    
    // include external files module
    const day = date.getDate();

    // start file named 'lists' and carry the data set
    res.render("list", {listTitle: day, newListItems: items});
});


app.post("/", function(req,res){

    // reassign to global letiable
    const item = req.body.newItem;

    if(req.body.list === "Work"){
        workItems.push(item);
        res.redirect("/work");
    }else{
        // push items as array into global letiable
        items.push(item);
        // redirect to homepage
        res.redirect("/");
    }
});


app.get("/work", function(req, res){
    res.render("list",{listTitle: "Work Lists", newListItems: workItems});
});

app.post("/work", function(req,res){
    let item = req.body.item;
    res.redirect("/work");
})


app.listen(3000, function(){
    console.log("Server started on port 3000");
});