const express = require("express");
const bodyParse = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express()

app.use(bodyParse.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine', 'ejs')

const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

app.post("/", function(req, res) {

    console.log(req.body);
    let item = req.body.item
    
    if (req.body.button === "Work") {
        workItems.push(item);
        res.redirect("/work")
    } else {
        items.push(item);
        res.redirect("/")
    }
})

app.get("/", function(req, res){
    day = date.getDate()
    res.render("list", {listTitle: day, newListItems: items})
})

app.post("/work", function(req, res) {
    let workItem = req.body.workItem
    workItems.push(workItem);
    res.redirect("/work")
})

app.get("/work", function(req, res){
    res.render("list", {listTitle: "Work List", newListItems: workItems})
})

app.listen(process.env.PORT || 3000, function(req, res){
    console.log("Server is running on port 3000");
})
