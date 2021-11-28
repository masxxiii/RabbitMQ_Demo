//Modules
const mongoose = require("mongoose");

//Connecting database and creating our schema
mongoose.connect("mongodb://127.0.0.1:27017/testnewDB");


//Creating our schema
const newItemsSchema = new mongoose.Schema({
    name: String
});

//Creating a new collection based on schema
const ItemCollection = mongoose.model("Item", newItemsSchema);
module.exports = ItemCollection;