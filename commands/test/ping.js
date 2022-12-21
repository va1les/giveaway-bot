const { SlashCommandBuilder } = require("@discordjs/builders");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Just a ping-pong command!'),
    run: async (client, interaction) => {
        interaction.reply({ content: 'Pong!', components: [new ActionRowBuilder().addComponents([new ButtonBuilder().setCustomId('ping').setLabel('Ping').setStyle(ButtonStyle.Secondary).setEmoji('🏓')])] })
    }
}