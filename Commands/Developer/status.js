const { CommandInteraction, Client, MessageEmbed } = require("discord.js");

module.exports = {
    name: "status",
    description: "Displays the status of the client.",
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {

        const Response = new MessageEmbed()
        .setColor('AQUA')
        .setDescription(`**Client: \`🟢 ONLINE\` - \`${client.ws.ping}ms\`\n **Uptime**: <t:${parseInt(client.readyTimestamp)}:R>`)

        interaction.reply({embeds: [Response]});
    }
}

function switchTo(val) {
    var status = " ";
    switch(val) {
        case 0 : status = `🔴 DISCONNECTED`
        break;
        case 1 : status = `🟢 CONNECTED`
        break;
        case 2 : status = `🟠 CONNECTING`
        break
        case 3 : status = `🟣 DISCONNECTING`
        break;
    }
    return status;
}