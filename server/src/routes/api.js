

/**
 * @param req.body.newItem New element from the request body.
 * @param req.body.idItem ID of an element from the request body.
 */

//Creating a connection with RabbitMQ using the url from CloudAMQP
amqp.connect("amqps://mnygygnx:CNFPQPCj0sERo9H9KGPz1nRTtAn2QgJF@kangaroo.rmq.cloudamqp.com/mnygygnx", (err0,connection) => {

    if(err0) {
        throw err0;
    }

    //creating a channel
    connection.createChannel((err1,channel) => {

        if(err1) {
            throw err1;
        }

        //Get request for checking the database when the website loads
        router.get("/home", async function (req, res) {

            let data = await new Todo().getItems();
            await channel.sendToQueue("items_get",Buffer.from(JSON.stringify(data)));
            res.json(data);
        });

        //Get request for checking the progress
        router.get("/progress", async function(req,res) {

            let count = await new Todo().getProgress();
            await channel.sendToQueue("items_count",Buffer.from(JSON.stringify(count)));
            res.json(count);
        });

        //A post request for adding items
        router.post("/", async function(req, res) {

            let data = await new Todo().addItem(req.body.newItem);
            await channel.sendToQueue("items_add",Buffer.from(data));
            res.redirect("/home");
        });

        //A put request for updating items
        router.put("/",async function(req, res) {

            let data = new Todo().updateItem(req.body.idItem,req.body.newItem);
            await channel.sendToQueue("items_update",Buffer.from(JSON.stringify(data)));
            res.redirect("/home");
        });

        //A delete request for deleting items
        router.delete("/", async function(req, res) {

            let data = new Todo().deleteItem(req.body.idItem);
            await channel.sendToQueue("items_delete",Buffer.from(JSON.stringify(data)));
            res.redirect("/home");
        });

        //Close the connection to RabbitMQ before we turn off the server
        process.on('beforeExit', () => {
            console.log("Closing the connection");
            connection.close();
        });
    });
});

module.exports = router;
