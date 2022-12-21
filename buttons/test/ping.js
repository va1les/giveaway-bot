module.exports = {
    data: {
        id: 'ping'
    },
    run: async (client, interaction) => {
        interaction.reply({ content: `Pong again 🏓`, ephemeral: true })
    }
}