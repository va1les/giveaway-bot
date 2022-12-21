const { ButtonStyle, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js")

module.exports = {
    data: {
        id: 'giveaway'
    },
    run: async (client, interaction) => {
        // interaction.message.id
        const data = await client.db.giveaway.findOne({ message: interaction.message.id })
        if (data?.members.includes(interaction.user.id)) {
            const msg = await interaction.reply({ content: `❌ You are already participating in the giveaway.`, components: [new ActionRowBuilder().addComponents([new ButtonBuilder().setCustomId('leave').setLabel('Leave Giveaway').setStyle(ButtonStyle.Danger)])], ephemeral: true }).catch(() => null);
            const collector = msg.createMessageComponentCollector();
            setTimeout(() => {
                interaction.editReply(
                    { components: [new ActionRowBuilder().addComponents([new ButtonBuilder().setDisabled(true).setCustomId('leave2').setLabel('Leave Giveaway').setStyle(ButtonStyle.Danger)])], ephemeral: true }
                ).catch(() => null);
                collector.stop()
            }, 20 * 1000)
            collector.on("collect", async i => {
                if (i.customId === "leave") {
                    await client.db.giveaway.updateOne({ message: interaction.message.id }, {
                        $pull: {
                            "members": interaction.user.id
                        }
                    })
                    const message = await interaction.channel.messages.fetch(data?.message).then(async msg => {
                        const data = await client.db.giveaway.findOne({ message: interaction.message.id })
                        msg.edit({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle(data?.prize)
                                    .setDescription(`**${data?.description !== null ? data?.description + "**\n\n" : ''}Ends: <t:${Math.floor(data?.duration_end / 1000)}:R>\nHosted by: <@${data?.hosted}>\nEntries: **${data?.members.length}**\nWinners: **${data?.winners}**`).setTimestamp(data?.duration_end).setColor(client.colors.default)
                            ], components: [new ActionRowBuilder().addComponents([new ButtonBuilder().setCustomId('giveaway').setStyle(ButtonStyle.Primary).setEmoji('🎉')])]
                        }, err => {
                            return;
                        }).catch(() => null);
                    })
                    i.update({ content: `🎉 You have successfully left the giveaway!`, components: [] }).catch(() => null);
                    collector.stop();
                }
            })
        } else {
            interaction.reply({ content: `🎉 You have been added to the list of members.`, ephemeral: true }).catch(() => null);
            await client.db.giveaway.updateOne({ message: interaction.message.id }, {
                $addToSet: { "members": interaction.user.id }
            })
            await interaction.channel.messages.fetch(data?.message).then(async msg => {
                const data = await client.db.giveaway.findOne({ message: interaction.message.id })
                msg.edit({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(data?.prize)
                            .setDescription(`**${data?.description !== null ? data?.description + "**\n\n" : ''}Ends: <t:${Math.floor(data?.duration_end / 1000)}:R>\nHosted by: <@${data?.hosted}>\nEntries: **${data?.members.length}**\nWinners: **${data?.winners}**`).setTimestamp(data?.duration_end).setColor(client.colors.default)
                    ], components: [new ActionRowBuilder().addComponents([new ButtonBuilder().setCustomId('giveaway').setStyle(ButtonStyle.Primary).setEmoji('🎉')])]
                }, err => {
                    return;
                }).catch(() => null);
            }
            )
        }
    }
}