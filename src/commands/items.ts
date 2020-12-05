import { CommandContext } from '../models/command_context';
import { Command } from './commands';
import { BotConfig, config } from '../config/config';
import discord from 'discord.js'

export class ItemsCommand implements Command {
  commandNames = ['items', 'item'];

  getHelpMessage(commandPrefix: string): string {
    return `Use ${commandPrefix}item [item name] to get a item description.`;
  }

  async run(parsedUserCommand: CommandContext): Promise<void> {
    this.parseArguments(parsedUserCommand);

    await this.embeddedPost(parsedUserCommand);

  }

  hasPermissionToRun(parsedUserCommand: CommandContext): boolean {
    return true;
  }

  parseArguments(parsedUserCommand: CommandContext): string {
    let itemName = parsedUserCommand.args.join(' ').toLowerCase();
    return itemName;
  }

  async embeddedPost(parsedUserCommand: CommandContext): Promise<void> {
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

    parsedUserCommand.originalMessage.channel.send(exampleEmbed);
  }
}