//Modules
const ItemCollection = require('../config/db');
const dateModule = require('../public/js/date');

class Todo {

    //Get all the items from the database
    async getItems() {

        let data = await ItemCollection.find();
        if(Object.keys(data).length === 0) {
            return { Message: "The database is currently empty.", Date: dateModule.getDate() };
        }
        else {
            return data;
        }
    }

    //get the number of remaining tasks left
    async getProgress() {

        let count = await ItemCollection.count();
        return {tasksRemaining: count};
    }

    //Add item to the database
    async addItem(newItem) {

        const item = await new ItemCollection({
            name: newItem
        });

        item.save().then( res => {
            console.log(`Item ${res} added to the database.`);
        });
        return `Item ${newItem} added to the database.`;
    }

    //Update item in a database
    updateItem(idOld,itemNew) {
        
        const filter = { _id: idOld };
        const update = { name: itemNew };
        
        let doc = ItemCollection.findOne(filter,function(err,itemsFound) {
            if(err) {
                console.log(err);
            } else {
                return itemsFound;
            }
        });
        console.log("Item with ID: " + idOld + " updated!");
        doc.updateOne(update);
        return `Item with ID: ${idOld} updated!`;
    }

    //delete item from a database
    deleteItem(itemID) {

        ItemCollection.findByIdAndRemove(itemID, function(err) {
            if (!err) {
            console.log("Item deleted from database!");
        }});
        return `Item with ID: ${itemID} deleted!`;
    }

}

module.exports = Todo;