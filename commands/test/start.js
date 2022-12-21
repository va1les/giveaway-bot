const { SlashCommandBuilder } = require("@discordjs/builders");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const ms = require("ms");
module.exports = {
    data: new SlashCommandBuilder()
        .setName('start')
        .setNameLocalizations({ "ru": "начать" })
        .setDescription('Allows you to launch giveaway.')
        .setDescriptionLocalizations({ 'ru': "Позволяет запустить розыгрыш." })
        .addStringOption(option => option.setName('prize').setNameLocalizations({ "ru": "приз" }).setDescription('Enter the prize of this giveaway.').setDescriptionLocalizations({ "ru": "Введите приз этого розыгрыша." }).setRequired(true))
        .addNumberOption(option => option.setName('winners').setNameLocalizations({ "ru": "победителей" }).setDescription('Enter the number of winners in the giveaway.').setDescriptionLocalizations({ "ru": "Введите число победителей в розыгрыше." }).setMaxValue(99).setRequired(true))
        .addStringOption(option => option.setName('duration').setNameLocalizations({ "ru": "длительность" }).setDescription('Enter the duration of the giveaway.').setDescriptionLocalizations({ "ru": "Введите длительность розыгрыша." }).setRequired(true))
        .addStringOption(option => option.setName('description').setNameLocalizations({ "ru": "описание" }).setDescription('Enter a description or conditions of the giveaway.')).setDescriptionLocalizations({ "ru": "Введите описание или условия розыгрыша." }),
    run: async (client, interaction) => {
        const prize = interaction.options.getString("prize");
        const winners = interaction.options.getNumber("winners");
        const duration = interaction.options.getString("duration");
        const description = interaction.options.getString("description");
        await interaction.reply({ content: `🎉 Giveaway has been started.`, ephemeral: true });
        await interaction.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle(prize)
                    .setDescription(`**${description !== null ? description + "**\n\n" : ''}Ends: <t:${Math.floor((Date.now() + ms(duration)) / 1000)}:R>\nHosted by: ${interaction.user}\nEntries: **0**\nWinners: **${winners}**`).setTimestamp(Math.floor((Date.now() + ms(duration)))).setColor(client.colors.default)
            ], components: [new ActionRowBuilder().addComponents([new ButtonBuilder().setCustomId('giveaway').setStyle(ButtonStyle.Primary).setEmoji('🎉')])]
        }).then(async msg => {
            await client.db.giveaway.create({
                description: description || null,
                prize: prize,
                duration: ms(duration),
                duration_end: Math.floor((Date.now() + ms(duration))),
                winners: winners,
                hosted: interaction.user.id,
                members: [],
                gid: interaction.guild.id,
                channel: interaction.channel.id,
                message: msg.id,
                end: false
            })
        })

    }
}