const { ActivityType, EmbedBuilder } = require("discord.js");
const { default: mongoose } = require("mongoose");

module.exports = async (client) => {
    client.user.setActivity({
        name: "/start",
        type: ActivityType.Playing,
    });
    const commands = [];
    client.commands.each(command => commands.push(command.data));
    mongoose.set("strictQuery", false);
    mongoose.connect(process.env.uri, { keepAlive: true, }).then(x => console.log(`[DATABASE]: `.green.bold + `База Данных успешно подключена.`.blue.bold), y => console.log(`[DATABASE]: `.red.bold + `База Данных не подключена.`.blue.bold))
    client.application.commands.set(commands);

    setInterval(async () => {
        const giveaways = await client.db.giveaway.find();
        for (let g of giveaways) {
            if (Date.now() > g.duration_end && g.end === false) {
                await client.db.giveaway.updateOne({ message: g.message }, {
                    $set: { "end": true }
                });
                const winners = g.members.sort(function () {
                    return Math.random() - 0.5;
                })
                const winners_array = []
                for (let i = 0; i < winners.length; i++) {
                    winners_array.push(`<@${winners[i]}>`)
                };
                await client.channels.fetch(g.channel).then(async channel => {
                    await channel.messages.fetch(g.message).then(msg => {
                        msg.edit({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle(g.prize)
                                    .setDescription(`**${g?.description !== null ? g?.description + "**\n\n" : ''}Ended: <t:${Math.round(g?.duration_end / 1000)}:R>\nHosted by: <@${g?.hosted}>\nEntries: **${g?.members.length}**\nWinners: **${winners_array.slice(0, g.winners).join(', ') || "No"}**`).setTimestamp(g?.duration_end).setColor(client.colors.default)
                            ], components: []
                        });
                        if (winners_array.length !== 0) {
                            msg.reply({
                                content: `Congratulations ${winners_array.slice(0, g.winners).join(', ')}! You won the **${g.prize}**!`
                            }).catch(() => null)
                        } else {
                            msg.reply({
                                content: `❌ No one participated in the giveaway.`
                            }).catch(() => null)
                        }
                    }, e => {
                        { return; }
                    })
                }, e => { return; })
            }
        }
    }, 1000);
}