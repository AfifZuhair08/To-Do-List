// includes library
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// import js files
const date = require(__dirname + "/date.js");

// initiate express server
const app = express();

// set server settings
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.set('useFindAndModify', false);

// Mongoose Connection
mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true});

// SCHEMA
const itemsSchema = new mongoose.Schema({
    name: String,
});

// MODEL
const Item = new mongoose.model("Item", itemsSchema);

// DOCUMENT
const drink = new Item({
    name: "Drink Water",
});
const eat = new Item({
    name: "Eat food",
});
const clean = new Item({
    name: "Clean dishes",
});

// ALL IN DEFAULT ARRAY
const defaultItems = [drink, eat, clean];

// INSERT ALL DOCS
// Item.insertMany(defaultItems, function (err){
//     if (err){
//         console.log(err);
//     }else{
//         console.log("Successfully inserted all items");
//     }
// });


app.get("/", function(req,res){
    
    // include external files module
    // const day = date.getDate();
    Item.find({}, function(err, foundItems){

        if(foundItems.length === 0){
            Item.insertMany(defaultItems, function (err){
                if (err){
                    console.log(err);
                }else{
                    console.log("Successfully inserted all items");
                }
            });
            res.redirect("/");
        }else{
            // start file named 'lists' and carry the data set
            res.render("list", {listTitle: "Today", newListItems: foundItems});
        }
    });
});


app.post("/", function(req,res){

    // reassign to global letiable
    const itemName = req.body.newItem;

    const item = new Item({
        name: itemName
    });

    item.save();

    // redirect to homepage
    res.redirect("/");
});

app.post("/delete", function(req, res){
    const checkedItemId = req.body.checkbox;

    Item.findByIdAndRemove(checkedItemId, function(err){
        if(err){
            console.log(err);
        }else{
            console.log("Successfully delete checked item");
        }
    });

    res.redirect("/");
});


app.listen(3000, function(){
    console.log("Server started on port 3000");
});