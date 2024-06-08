
"use strict"
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
    }


}


const config_ = {
    multipleStatements: true,
    acquireTimeout: 3,
    database: DB_NAME,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: DB_PORT,
}
const mysql = require('mysql2/promise');

const con = mysql.createConnection(
    config_
  /*  {
    host: 'v2devproduct.ciszhlbpyotd.us-east-2.rds.amazonaws.com',
    user: 'gladiator', // Replace with your DB username
    password: 'Cjz1oZEIIk3KS61QzqFG', // Replace with your DB password
    database: 'product', // Replace with your DB name 
    port: 54321 // Your MySQL port (default is 3306)
}
*/

);
con.

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

module.exports = con



