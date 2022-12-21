const { EmbedBuilder } = require("discord.js");

function defaultHandler(interaction) {
    return interaction.reply({
        content: "> ⚠ Простите, но данная интеракция больше недоступна.",
        allowedMentions: {
            repliedUser: false
        },
        ephemeral: true
    });
}

module.exports = async (client, interaction) => {
    function handleInteraction(type) {
        const interact = type === 'commands' ? client[type].get(interaction.commandName) : client[type].get(interaction.customId)
        if (interact && interact.run) interact.run(client, interaction)
    }
    if (!await client.db.user.findOne({ uid: interaction.user.id, gid: interaction.guild.id })) { await client.db.user.create({ uid: interaction.user.id, gid: interaction.guild.id }); }
    if (!await client.db.guild.findOne({ gid: interaction.guild.id })) { await client.db.guild.create({ gid: interaction.guild.id }); }
    if (interaction.isCommand()) return handleInteraction('commands')
    else if (interaction.isButton()) return handleInteraction('buttons')
    else return handleInteraction('selectmenues')
}