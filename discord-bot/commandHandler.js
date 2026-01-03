const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js')

module.exports = (client) => {
    client.commands = new Map();

    const loadCommands = (dir) => {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.lstatSync(filePath);
            if (stat.isDirectory()) {
                loadCommands(filePath);
            } else if (file.endsWith('.js')) {
                const command = require(filePath);
                if (command.name) {
                    client.commands.set(command.name, command);
                    console.log("\x1b[1;32m%s\x1b[0m", `✅ Command loaded: ${command.name}`);
                }
            }
        }
    };

    loadCommands(path.join(__dirname, 'commands'));

    client.on('messageCreate', async (message) => {
        const { prefix } = require('./config.js');

        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName);
        if (!command) return;

        try {
            await command.execute(message, args);
        } catch (err) {
            console.error("\x1b[1;31m%s\x1b[0m", err);
            const embed = new EmbedBuilder()
                .setTitle('❌ Command Error')
                .setDescription(
                    '> Une erreur est survenue lors de l\'exécution de cette commande.\n' +
                    `\`\`\`ansi\n[31m${err}[0m\n\`\`\``
                )
                .setTimestamp()
                .setFooter({ text: command.author.tag, iconURL: command.author.displayAvatarURL() })
            message.reply({ embeds: [embed] });
        }
    });
};