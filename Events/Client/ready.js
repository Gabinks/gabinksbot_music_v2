require('dotenv').config();
const { Client, MessageEmbed } = require("discord.js")
const path = require('path')
const mongoose = require("mongoose");
const Database = process.env.DATABASE;

module.exports = {
    name: "ready",
    once: true,
    /**
    * @param {Client} client
    */
    execute(client) {

        console.log("The client is now ready")
        client.user.setActivity('Type "/music play" to play music🎶!', { type: 'LISTENING' })

        //epress section

        const clientDetails = {
            guilds: client.guilds.cache.size,
            users: client.users.cache.size,
            channels: client.channels.cache.size
        }

        const express = require('express');

        const app = express();

        const port = 3000 || 3001;

        app.get('/', (req, res) => {
            res
                .status(200)
                res.sendFile('landingPage.html', {root: 'pages'});
        })

        app.get('/info', (req, res) => {
            res.status(200).send(clientDetails);
        })

        app.listen(port)

        
        if (!Database) return;
        mongoose.connect(Database, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(() => {
            console.log("Connected to the database!");
        }).catch(err => {
            console.log(err);
        });

        setInterval(async function () {
            const fetch = require("node-superfetch");

            let user = "jbzzed"

            const uptime = await fetch.get(`https://decapi.me/twitch/uptime/${user}`);
            const avatar = await fetch.get(`https://decapi.me/twitch/avatar/${user}`);
            const viewers = await fetch.get(`https://decapi.me/twitch/viewercount/${user}`);
            const title = await fetch.get(`https://decapi.me/twitch/title/${user}`);
            const game = await fetch.get(`https://decapi.me/twitch/game/${user}`);

            const twitch = require("../Twitch/twitchSchema.js");
            let data = await twitch.findOne({ user: user, title: title.body })

            if(uptime.body === `${user} is offline`){

                const embed = new MessageEmbed()
                    .setAuthor({ "name": `${user}`, "iconURL": `${avatar.body}` })
                    .setTitle(`${title.body}`)
                    .setThumbnail(`${avatar.body}`)
                    .setURL(`https://www.twitch.tv/${user}`)
                    .addField("Game", `${game.body}`, true)
                    .addField("Viewers", `${viewers.body}`, true)
                    .setImage(`https://static-cdn.jtvnw.net/previews-ttv/live_user_${user}-620x378.jpg`)
                    .setColor('BLURPLE')
                    
                if(!data){
                    const newData = new twitch({
                        user, user,
                        title: `${title.body}`
                    })

                    await client.channels.cache.get("958489401413992491").send({ content: `🔴 ${user} est maintenant en **LIVE** !\nhttps://www.twitch.tv/${user}`, embeds: [embed] })

                    return await newData.save()
                }   
                    if(data.title === `${title.body}`) return;

                    await client.channels.cache.get("958489401413992491").send({ content: `🔴 ${user} est maintenant en **LIVE** !\nhttps://www.twitch.tv/${user}`, embeds: [embed] })

                    await twitch.findOneAndUpdate({ user: user }, { title: `${title.body}` })
            }
        }, 120000)
    }
}