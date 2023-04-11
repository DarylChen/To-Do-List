const express = require("express");
const bodyParse = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express()

app.use(bodyParse.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine', 'ejs')

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

const itemSchema = new mongoose.Schema({
    name: String
  });

const Item = mongoose.model('Item', itemSchema);

const item1 = new Item({
    name: "11111111111111111111!"
});

const item2 = new Item({
    name: "22222222222222222222!"
});

const item3 = new Item({
    name: "33333333333333333333!"
});

const defaultItems = [item1, item2, item3];

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemSchema]
  });


const List = mongoose.model('List', listSchema);

app.post("/", function(req, res) {

    console.log(req.body);
    let itemName = req.body.item;
    let listName = req.body.list;

    const item = new Item({
        name: itemName
    });

    if (listName === "Today"){
        item.save();
        res.redirect("/");
    } else {
        List.findOne({name: listName}).exec().then((exist) => {
            exist.items.push(item);
            exist.save().then(() => {
                res.redirect("/" + listName);
                });
            }
    )}
})

app.post("/delete", function(req, res) {
    let checkedItemId = req.body.checkbox;
    let listName = req.body.listName;
    console.log(listName);

    if (listName === "Today") {
        Item.findByIdAndRemove(checkedItemId).exec()
        .then((removedDoc) => {
            console.log("Removed document:", removedDoc);
            res.redirect("/");
        })
        .catch((err) => {
            console.error("Error removing document:", err);
            res.status(500).send("Error removing document");
        });
    } else {
        Item.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}).exec()
        .then((removedDoc) => {
            res.redirect("/" + listName);
        })
        .catch((err) => {
            console.error("Error removing item:", err);
            res.status(500).send("Error removing item");
        });
    }
})

app.get("/", function(req, res){

    Item.find({}).exec().then(foundItems => {
        if (foundItems.length === 0){
            Item.insertMany(defaultItems).then(function () {
                console.log("Successfully saved defult items to DB");
                    }).catch(function (err) {
                console.log(err);
            });
            res.redirect("/");
        } else {
            res.render("list", {listTitle: "Today", newListItems: foundItems})
        }    
    }).catch(err => {
        console.error(err);
    });
})

app.get("/:customListName", function(req, res){
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name: customListName}).exec().then((exist) => {
        if (!exist) {
            const list = new List({
                name: customListName,
                items: defaultItems
            });
        
            list.save().then(() => {
                res.redirect("/" + customListName);
            });
        } else {
            res.render("list", {listTitle: exist.name, newListItems: exist.items})
        }
    })
    .catch((err) => {
        console.error(err);
    });
})

app.listen(process.env.PORT || 3000, function(req, res){
    console.log("Server is running on port 3000");
})
