/* eslint-disable */

// Imports
// -- Express
const express = require('express');

// -- Environment Variables
const dotenv = require('dotenv');
dotenv.config();

// Core
const awsRekognition = require('./aws/rekognitionClient');
const sql = require('./sql/connection');
const awsRouter = require('./routers/awsRouter');
const { Redshift } = require('aws-sdk');
const { response, json } = require('express');

// Objects
const PORT = 6464;
const app = express();
app.use(express.json());

// app.listen(PORT, () => {
//     console.log(`[Server] Listening on PORT ${PORT}`);
// });

app.listen(3000);

//ROUTES
app.get('/', (req, res) => {
    res.status(200).send('This is the Lost Pet Finder API');
});

//dummy function to stand in for aws rekognition
function awsDummy(){
    return {
        "species": "dog",
        "colour": "red",
        "size": "small"
    };
}

//dummy function to stand in for queries of our database
function sqlDummy() {
    return [
        {"species": "dog",
        "colour": "red",
        "size": "small"},
        {"species": "cat",
        "colour": "white",
        "size": "big"}
    ];
}

//function that combines the posted data with aws rekognition tags
function aggregateData(req) {
    var filename = "";
    var location = [0,0];
    var date = "";
    var userid = 0;
    var tags = [];

    filename = req.body.filename;
    location  = req.body.location;
    date = req.body.date;
    userid = req.body.userid;

    //aws call for tags
    tags = awsDummy();

    var dbEntry = Object.assign({}, req.body, tags);

    return dbEntry;
}


// app.get('/createpoststable', (req, res) => {
//     let request = 'CREATE TABLE posts(id int AUTO_INCREMENT, title VARCHAR(255), body VARCHAR(255), PRIMARY KEY (id))';
//     sql.query(request, (err, result) => {
//         if(err) throw err;
//         console.log(result);
//         res.send('Posts table created....');
//     })
// });



app.use('/aws', awsRouter);

// Shutdown Protocol
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

function shutdown() {
    sql.end((err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('[MySQL] Successful disconnection!');
        }

        console.log('[Server] Exiting process');
        process.exit();
    });
}