const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.set('view engine', 'ejs');

app.get("/", function(req,res){
    var today = new Date();
    var currentDay = today.getDay();
    var day = "";
    
    res.set("Content-Type", "text/html");

    // num represents the day turn
    if (currentDay === 6 || currentDay === 0){
        day = "Weekend";
        // write and send data
        res.write("<h2>It's weekend !</h2>");
        res.send();
    }else{
        day = "Weekday";
        // alternative to res.write() and res.send(), we can send a file to represent the info
        res.sendFile(__dirname + "/index.html");
    }
});

app.listen(3000, function(){
    console.log("Server started on port 3000");
});