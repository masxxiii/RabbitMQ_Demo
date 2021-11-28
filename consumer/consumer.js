//Modules
const express = require("express");
const app = express();
var amqp = require('amqplib/callback_api');

//The middleware for parsing and configuring
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const PORT = process.env.port || 3001;

//Creating a connection with RabbitMQ using the url from CloudAMQP
amqp.connect("amqps://mnygygnx:CNFPQPCj0sERo9H9KGPz1nRTtAn2QgJF@kangaroo.rmq.cloudamqp.com/mnygygnx", (err0,connection) => {

    if (err0) {
        throw err0;
    }

    connection.createChannel((err1, channel) => {

        if (err1) {
            throw err1;
        }

        channel.assertQueue("items_get", { durable: false });
        channel.assertQueue("items_count", { durable: false });
        channel.assertQueue("items_add", { durable: false });
        channel.assertQueue("items_update", { durable: false });
        channel.assertQueue("items_delete", { durable: false });

        channel.consume("items_get", (msg) => {
            console.log(msg.content.toString());
        }, {
            noAck: true
        });

        channel.consume("items_count", (msg) => {
            console.log(msg.content.toString());
        }, {
            noAck: true
        });

        channel.consume("items_add", (msg) => {
            console.log(msg.content.toString());
        }, {
            noAck: true
        });

        channel.consume("items_update", (msg) => {
            console.log(msg.content.toString());
        }, {
            noAck: true
        });

        channel.consume("items_delete", (msg) => {
            console.log(msg.content.toString());
        }, {
            noAck: true
        });

        app.listen(PORT, function(){
            console.log("Server is running on port " + PORT +".");
        });

        //Close the connection to RabbitMQ before we turn off the server
        process.on('beforeExit', () => {
            console.log("Closing the connection");
            connection.close();
        });
    });
});
