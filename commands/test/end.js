const { SlashCommandBuilder } = require("@discordjs/builders");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('end')
        .setNameLocalizations({ ru: "закончить" })
        .setDescription('End a giveaway.').setDescriptionLocalizations({ ru: "Закончить розыгрыш" }).addStringOption(option => option.setName("message_id").setDescription(`ID of giveaway to end now.`).setDescriptionLocalizations({ "ru": "ID розыгрыша, который нужно закончить сейчас." }).setRequired(true)),
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true }).catch(() => null)
        const id = interaction.options.getString("message_id");
        const data = await client.db.giveaway.findOne({ message: id })
        if (!data) {
            return interaction.editReply({ content: `❌ The giveaway was not found.`, ephemeral: true }).catch(() => null)
        };
        if (data?.end === true) {
            return interaction.editReply({ content: `❌ This giveaway is already over.`, ephemeral: true }).catch(() => null)
        }
        await client.db.giveaway.updateOne({ message: id }, {
            $set: {
                "duration_end": Date.now(),
            }
        })
        interaction.editReply({ content: `✅ The giveaway has been successfully completed.`, ephemeral: true }).catch(() => null)
    }
}