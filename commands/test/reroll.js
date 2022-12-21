const { SlashCommandBuilder } = require("@discordjs/builders");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reroll')
        .setNameLocalizations({ "ru": "повторить" })
        .setDescription('Rerolls one new winner from a giveaway.').setDescriptionLocalizations({ ru: "Выбирает одного нового победителя розыгрыша." }).addStringOption(option => option.setName("message_id").setDescription(`ID of giveaway to reroll.`).setDescriptionLocalizations({ "ru": "ID завершённого розыгрыша." }).setRequired(true)),
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true }).catch(() => null)
        const id = interaction.options.getString("message_id");
        const data = await client.db.giveaway.findOne({ message: id })
        if (!data) {
            return interaction.editReply({ content: `❌ The giveaway was not found.`, ephemeral: true }).catch(() => null)
        };
        if (data?.end === false) {
            return interaction.editReply({ content: `❌ The giveaway is not over.`, ephemeral: true }).catch(() => null)
        }
        const channel = await interaction.guild.channels.fetch(data?.channel).catch(() => null);
        if (channel !== null) {
            const msg = await channel.messages.fetch(data?.message);
            const winners = data.members.sort(function () {
                return Math.random() - 0.5;
            })
            const winners_array = []
            for (let i = 0; i < winners.length; i++) {
                winners_array.push(`<@${winners[i]}>`)
            };
            if (winners_array.length !== 0) {
                interaction.editReply({ content: `✅ The winner has been successfully changed.`, ephemeral: true }).catch(() => null)
                msg.reply({ content: `🎉 **Rerolled!**\nCongratulations ${winners_array.slice(0, data.winners).join(', ')}! You won the **${data?.prize}**!` }).catch(() => null)
            } else {
                interaction.editReply({ content: `❌ No one participated in the giveaway.`, ephemeral: true }).catch(() => null)
            }
        }
    }
}