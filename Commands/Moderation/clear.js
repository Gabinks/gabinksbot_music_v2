const { CommandInteraction, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'clear',
    description: 'Deletes a specified numder of messages from a channel or a target.',
    permission: 'MANAGE_MESSAGES',
    options: [
        {
            name: 'amount',
            description: 'Select the amount of messages to delete from a channel or a target.',
            type: "NUMBER",
            required: true
        },
        {
            name: 'target',
            description: 'Select the target to delete messages from.',
            type: "USER",
            required: false
        }
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const { channel, options } = interaction;

        const Amount = options.getNumber('amount');
        const Target = options.getMember('target');

        const Messages = await channel.messages.fetch();

        const Response = new MessageEmbed()
        .setColor('LUMINOUS_VIVID_PINK')

        if (Target) {
            let i = 0;
            const filtered = [];
            (await Messages).filter((m) => {
                if (m.author.id === Target.id && Amount > i) {
                    filtered.push(m);
                    i++;
                }
            })

            await channel.bulkDelete(filtered, true).then(messages => {
                Response.setDescription(`🧹 Deleted ${messages.size} messages from ${Target}`);
                interaction.reply({embeds: [Response]});
            })
        } else {
            await channel.bulkDelete(Amount, true).then(messages => {
                Response.setDescription(`🧹 Deleted ${messages.size} messages`);
                interaction.reply({embeds: [Response]});
            })
        }
    }
}