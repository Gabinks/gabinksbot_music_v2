require('dotenv').config();
const { Client } = require("discord.js")
const mongoose = require("mongoose");
const { Database } = process.env.DATABASE;
module.exports = {
    name: "ready",
    once: true,
    /**
    * @param {Client} client
    */
    execute(client) {
        console.log("The client is now ready")
        client.user.setActivity('Type "/music play" to play music🎶!', { type: 'LISTENING' })

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

            let user = "loltyler1"

            const uptime = await fetch.get(`https://decapi.me/twitch/uptime/${user}`);
            const avatar = await fetch.get(`https://decapi.me/twitch/avatar/${user}`);
            const viewers = await fetch.get(`https://decapi.me/twitch/viewercount/${user}`);
            const title = await fetch.get(`https://decapi.me/twitch/title/${user}`);
            const game = await fetch.get(`https://decapi.me/twitch/game/${user}`);

            const twitch = require("../Twitch/twitchSchema.js");
            let data = await twitch.findOne({ user: user, title: title.body })

            if(uptime.body === `${user} is offline`){

                const embed = new Discord.MessageEmbed()
                    .setAuthor({ "name": `${user}`, "iconURL": `${avatar.body}` })
                    .setTitle(`${title.body}`)
                    .setthumbnail(`${avatar.body}`)
                    .setURL(`https://www.twitch.tv/${user}`)
                    .addField("Game", `${game.body}`, true)
                    .addField("Viewers", `${viewers.body}`, true)
                    .setimage(`https://static-cdn.jtvnw.net/previews-ttv/live_user_${user}-620x378.jpg`)
                    .setcolor("BLURPLE")
                    
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