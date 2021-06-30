// includes library
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

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


// SCHEMA
const listSchema = {
    name: String,
    items: [itemsSchema]
};

// MODEL
const List = new mongoose.model("List", listSchema);


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

app.get("/favicon.ico", function(req, res){
    res.redirect("/");
});

// DYNAMIC ROUTING
app.get("/:customListName" , function(req, res){
    const customListName = _.capitalize(req.params.customListName);
    console.log(req.params);

    // find results and return array
    List.findOne({name: customListName}, function(err, foundList){
        if(!err){
            if(!foundList){
                // no existing list & create new
                console.log("Doesnt exist!");

                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
            
                list.save();
                res.redirect("/" + customListName);

            }else{
                // existing list & skip save action
                console.log("Exist");

                res.render("list", {listTitle: foundList.name, newListItems: foundList.items});

            }
        }
    });

});


app.post("/", function(req,res){

    // reassign to global letiable
    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    });

    if(listName === "Today"){
        // save & redirect to root
        item.save();
        res.redirect("/");
    }else{
        // find the list and add items
        List.findOne({name: listName}, function(err, foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        });
    }
});

app.post("/delete", function(req, res){
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    // check if post request is default or custom listName
    if(listName === "Today"){
        
        Item.findByIdAndRemove(checkedItemId, function(err){
            if(err){
                console.log(err);
            }else{
                console.log("Successfully delete checked item");
            }
        });

        res.redirect("/");

    }else{
        List.findOneAndUpdate(
            {name: listName}, 
            {$pull:{
                items: {
                    _id: checkedItemId
                }
            }},
            function(err, foundList){
                if(!err){
                    res.redirect("/" + listName);
                }else{
                    res.redirect("/" + listName);
                }
            }
        );
    }

});


app.listen(3000, function(){
    console.log("Server started on port 3000");
});