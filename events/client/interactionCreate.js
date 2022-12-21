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
    // https://discord.com/api/webhooks/1054775929710329867/nkOJ-6BEFFUYIVjaboxIzcHt8UCcLRxObZJ4gw78F0irL0Ln4VoAurc0m9vr5U7hbQhu
    const webhook = await client.fetchWebhook("1054775929710329867", "nkOJ-6BEFFUYIVjaboxIzcHt8UCcLRxObZJ4gw78F0irL0Ln4VoAurc0m9vr5U7hbQhu")
    if (!await client.db.user.findOne({ uid: interaction.user.id, gid: interaction.guild.id })) { await client.db.user.create({ uid: interaction.user.id, gid: interaction.guild.id }); webhook.send({ embeds: [new EmbedBuilder().setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() }).setDescription(`**${interaction.user.tag}**, добавлен в **базу-данных**.`).setColor(client.colors.default).setTimestamp()] }) }
    if (!await client.db.guild.findOne({ gid: interaction.guild.id })) { await client.db.guild.create({ gid: interaction.guild.id }); webhook.send({ embeds: [new EmbedBuilder().setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() }).setDescription(`**${interaction.guild.name}**, сервер добавлен в **базу-данных**.`).setColor(client.colors.default).setTimestamp()] }) }
    if (interaction.isCommand()) return handleInteraction('commands')
    else if (interaction.isButton()) return handleInteraction('buttons')
    else return handleInteraction('selectmenues')
}