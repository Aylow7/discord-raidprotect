const { Client, GatewayIntentBits } = require('discord.js');
const { token, prefix } = require('./config');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

require('./commandHandler')(client);

client.once('ready', () => {
    console.log("\x1b[1;32m%s\x1b[0m", `Bot ${client.user.tag} logged succesfully !`);
});

client.login(token).catch(err => { console.error("\x1b[1;31m%s\x1b[0m", 'Error login : ' + err) })