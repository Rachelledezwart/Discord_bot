import discord, { Message } from 'discord.js'
import { CommandHandler } from './commands/command_handler'
import { BotConfig, config } from './config/config';

function validateConfig(botConf: BotConfig) {
    if (!botConf.token) {
        throw new Error('You need to specify your Discord bot token!');
    }
}

validateConfig(config);

const commandHandler = new CommandHandler(config.prefix);

const client = new discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', (message: Message) => {
    commandHandler.handleMessage(message);
});

client.on('error', (e) => {
    console.error('Discord client error!', e);
});

client.login(config.token);