import { CommandContext } from '../models/command_context';
import { Command } from './commands';
import { config } from '../config/config';
import discord from 'discord.js'

export class ItemsCommand implements Command {
  commandNames = ['items', 'item'];

  getHelpMessage(commandPrefix: string): string {
    return `Use ${commandPrefix}item [item name] to get a item description.`;
  }

  async run(parsedUserCommand: CommandContext): Promise<void> {

    if (parsedUserCommand.args.length === 0){
        await parsedUserCommand.originalMessage.channel.send('Please insert a name for the item you are looking for');
    } else if (parsedUserCommand.args.length >= 25) {
        await parsedUserCommand.originalMessage.channel.send('Im pretty sure this is not an item. Please try another argument.');
    } else {
      let itemName = this.parseArguments(parsedUserCommand.args);
      let message = await this.embeddedPost(itemName);

      parsedUserCommand.originalMessage.channel.send(message);
    }

  }

  hasPermissionToRun(parsedUserCommand: CommandContext): boolean {
    return true;
  }

  parseArguments(arg: string[]): string {
    let itemName = arg.join(' ').toLowerCase();
    return itemName;
  }

  async embeddedPost(itemName: string): Promise<any> {
    const exampleEmbed = new discord.MessageEmbed()
      .setColor(config.color)
      .setTitle('Thunder Arrows')
      .setURL(`${config.website}/items/thunder-arrows/`)
      .setAuthor(config.name, config.logo, config.website)
      .setDescription('This is a normal arrow with an alchemical treatment. When this arrow hits a target, it must make a concentration roll equal to the Accuracy check of the attack, or it will be paralyzed for one round.')
      .addFields(
        { name: 'Type', value: 'Ammo', inline: true },
        { name: 'Weight', value: '0.1', inline: true },
        { name: 'Base Value', value: '0.2', inline: true },
        { name: 'Rarity', value: 'Scarce', inline: true },
      )

    return exampleEmbed
  }

}