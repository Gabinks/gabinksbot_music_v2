require('dotenv').config();
const { Client, Collection } = require("discord.js");
const client = new Client({intents: 32767});

client.commands = new Collection()

require("./Handlers/Events")(client);
require("./Handlers/Commands")(client);

const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");

client.distube = new DisTube(client, {
    emitNewSongOnly: true,
    leaveOnFinish: true,
    emitAddSongWhenCreatingQueue: false,
    plugins: [new SpotifyPlugin()]
});
module.exports = client;

client.login(process.env.TOKEN);