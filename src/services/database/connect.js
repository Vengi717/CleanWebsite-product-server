



// dbConnection.js
const debug = true;
const { config } = require("dotenv")

require("dotenv").config()

let DB_NAME;
let DB_USERNAME;
let DB_PASSWORD;
let DB_HOST;
let DB_PORT;

if (debug) {
    console.log("-------------- Is prod: ", process.env.AWS_SESSION_TOKEN);
    console.log("this: ",process.env)
}

if (!process.env.AWS_SESSION_TOKEN) {

    DB_NAME = process.env.DEV_LOCAL_DB_NAME;
    DB_USERNAME = process.env.DEV_LOCAL_DB_USERNAME;
    DB_PASSWORD = process.env.DEV_LOCAL_DB_PASSWORD;
    DB_HOST = process.env.DEV_LOCAL_DB_HOST;
    DB_PORT = process.env.DEV_LOCAL_DB_PORT;
    if (debug) {
            console.log("Local DB Name: ", DB_NAME);
            console.log("Local DB Username: ", DB_USERNAME);
            console.log("Local DB Host: ", DB_HOST);
            console.log("Local DB Password: ", DB_PASSWORD);
            console.log("Local DB Port: ", DB_PORT);
    }
} else {
    DB_NAME = process.env.DEV_REMOTE_DB_NAME;
    DB_USERNAME = process.env.DEV_REMOTE_DB_USERNAME;
    DB_PASSWORD = process.env.DEV_REMOTE_DB_PASSWORD;
    DB_HOST = process.env.DEV_REMOTE_DB_HOST;
    DB_PORT = process.env.DEV_REMOTE_DB_PORT;
      if (debug) {
          console.log("Remote DB Name: ", DB_NAME);
          console.log("Remote DB Username: ", DB_USERNAME);
          console.log("Remote DB Host: ", DB_HOST);
          console.log("Remote DB Password: ", DB_PASSWORD);
          console.log("Remote DB Port: ", DB_PORT);
      }
}

const mysql = require("serverless-mysql");

const db = mysql({
    config: {
        host:DB_HOST ,
        database:DB_NAME ,
        user: DB_USERNAME,
        password:DB_PASSWORD ,
        port:DB_PORT
    },
});

module.exports = db;











/*"use strict"
const debug = true
const { config } = require("dotenv")

require("dotenv").config()
var DB_NAME
var DB_USERNAME
var DB_PASSWORD
var DB_HOST
var DB_PORT


if (debug) {
    console.log("-------------- Is dev: ", process.env.TYPE == "DEV_LOCAL")
    console.log("Type: ", process.env.TYPE)
}

if (process.env.TYPE == "DEV_LOCAL") {
    DB_NAME = process.env.DEV_LOCAL_DB_NAME
    DB_USERNAME = process.env.DEV_LOCAL_DB_USERNAME
    DB_PASSWORD = process.env.DEV_LOCAL_DB_PASSWORD
    DB_HOST = process.env.DEV_LOCAL_DB_HOST
    DB_PORT = process.env.DEV_LOCAL_DB_PORT
    if (debug) {

        console.log("Remote DB Name: ", DB_NAME);
        console.log("Remote DB Username: ", DB_USERNAME);
        console.log("Remote DB Host: ", DB_HOST);
        console.log("Loacl DBPassword: ", DB_PASSWORD);

        console.log("Remote DB Port: ", DB_PORT);
    }

} else {
    DB_NAME = process.env.DEV_REMOTE_DB_NAME
    DB_USERNAME = process.env.DEV_REMOTE_DB_USERNAME
    DB_PASSWORD = process.env.DEV_REMOTE_DB_PASSWORD
    DB_HOST = process.env.DEV_REMOTE_DB_HOST
    DB_PORT = process.env.DEV_REMOTE_DB_PORT
    if (debug) {

        console.log("Loacl DB Name: ", DB_NAME);
        console.log("Loacl DB Username: ", DB_USERNAME);
        console.log("Loacl DB Host: ", DB_HOST);
        console.log("Loacl DBPassword: ", DB_PASSWORD);
        console.log("Remote DB Port: ", DB_PORT);

    }


}

const connection = require("serverless-mysql")({
    //connectTimeout: 3, // TODO: implement something like this. This does not work
    //  timeout: 2,// TODO: implement something like this. This does not work
    config: {
        multipleStatements: true,
        acquireTimeout: 3,
        database: DB_NAME,
        user: DB_USERNAME,
        password: DB_PASSWORD,
        host: DB_HOST,
        port: DB_PORT,
    },
});


connection
    .connect()
    .then(() => {
        console.log("Connected to the database.");
    })
    .catch((err) => {
        console.error("Error connecting to the database:", err);
    });




module.exports = connection
*/