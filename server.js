
//THIS SHOULD NOT BE ON MASTER BRANCH


var express = require('express');
var fs = require('fs');
var app = express();
var socket = require('socket.io');
var server = app.listen(4000, function(){
    console.log('Listening on port 4000');
});
var io = socket(server);
var tableName = 'platform';
var zlib = require('zlib');

app.use(express.static('./public/'));

//This function creates a table and is a one-time run.
function createDB(){
    var pool = openPool();
    //The query for creating a table
    var creationQuery = {
        name: 'creating a table',
        text: 'CREATE TABLE '+tableName+ ' (name text, img bytea)'
    };
    pool.query(creationQuery);
    pool.end();
};

//By calling the following function you create a pool of connections
function openPool(){
    var Pool = require('pg').Pool;
    var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/narimant';
    var pool = new Pool(connectionString);
    return pool;
};
var pool = openPool();
//This function inserts the image into the database using the inserting query
function populateDB(query) {
    pool.query(query);
    console.log("Database updated");

};

//This function pulls the data from the database,using pulling query
// and then sends it to client who has requested for the image.
function pullData(query, socket){
    pool.query(query, (err, res) => {
        if (err) {
            console.log(err.stack);
        }
        else{
            if(res.rows[0] != undefined){
                socket.emit("pulledImage", {
                    data: res.rows[0].img
                });
                console.log('The image is sent to the client');
            }

            else
                console.log('Not found!');
            socket.emit("retry", {
                data: "Not found! Please try again."
            });



        }
    });
};

//createDB();

//When a user connects to the server the following code will run:
io.on('connection', function (socket) {

    //If the user sends an image which is sent, submit it to the database table
    socket.on('image', function (message) {
        // zlib.gzip(message.data, function(err, res){
        //    if(err) throw err;
        //     var insertingQuery = {
        //         name: 'inserting a row',
        //         text: 'INSERT INTO ' + tableName+ ' (name , img) VALUES ($1, $2) RETURNING *',
        //         values: [message.name, res ]
        //     };
        //     populateDB(insertingQuery);
        //
        // });
        var insertingQuery = {
            name: 'inserting a row',
            text: 'INSERT INTO ' + tableName+ ' (name , img) VALUES ($1, $2) RETURNING *',
            values: [message.name, message.data ]
        };
        populateDB(insertingQuery);


    });

    //If the user sends a request to have an image, pull it from the database:
    socket.on('message', function (message) {
        var pullingQuery = {
            name: 'pulling data from the table',
            text: 'SELECT img FROM '+ tableName+ ' WHERE name = $1 ',
            values: [message.data]
        };
        pullData(pullingQuery, socket);

    });
});

