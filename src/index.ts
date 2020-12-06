import discord, { Message } from 'discord.js'
import { CommandHandler } from './commands/command_handler'
require('dotenv').config()

function validateConfig(botConf: string) {
    console.log(botConf);
    if (!botConf) {
        throw new Error('You need to specify your Discord bot token!');
    }
}

validateConfig(process.env.TOKEN);

const commandHandler = new CommandHandler(process.env.PREFIX);

const client = new discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async message => {
    // Check if the message was sent in the channel with the specified id.
    // NOTE, this defines the message variable that is going to be used later.
    if(message.channel.id === process.env.CHANNELID){
        // let test = await message.channel.messages.fetch();
        console.log('test');
        setTimeout(() => {
            message.delete();
        }, 3600000);
    }
  })

client.on('message', (message: Message) => {
    commandHandler.handleMessage(message);
});

client.on('error', (e) => {
    console.error('Discord client error!', e);
});

client.login(process.env.TOKEN);