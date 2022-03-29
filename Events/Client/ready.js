require('dotenv').config();
const { Client } = require("discord.js")
const mongoose = require("mongoose");
const { Database } = require(process.env.Database);
module.exports = {
    name: "ready",
    once: true,
    /**
    * @param {Client} client
    */
    execute(client) {
        console.log("The client is now ready")
        client.user.setActivity('Type "/music play" to play music🎶!', {type: 'LISTENING'})

        if(!Database) return;
        mongoose.connect(Database, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(() => {
            console.log("Connected to the database!");
        }).catch(err => {
            console.log(err);
        });
    }
}