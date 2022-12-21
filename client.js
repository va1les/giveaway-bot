require("colors")
require("dotenv").config();
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { handleInteractions } = require('./handlers/handleInteractions')
const { handleEvents } = require('./handlers/handleEvents')
const { handleClietOptions } = require('./handlers/handleClientOptions')
const { options } = require('./utilites/clientOptions');
const User = require("./models/user");
const Guild = require("./models/guild");
const Giveaways = require("./models/giveaways");
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildPresences],
    partials: [Partials.Channel]
});

handleClietOptions(client, options)
handleInteractions(client)
handleEvents(client)

process.on("unhandledRejection", async (reason, promise) => {
    console.log(reason)
});
client.db = { user: User, guild: Guild, giveaway: Giveaways };
client.colors = { default: "#30BA8F" };
client.login(process.env.token).then(x => console.log(`[CLIENT]: `.green.bold + `Приложение успешно загружено.`.blue.bold), y => console.log(`[CLIENT]: `.red.bold + `Приложение не загружено.`.blue.bold))