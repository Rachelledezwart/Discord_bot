import { CommandContext } from '../models/command_context';
import { Command } from './commands';
import { config } from '../config/config';
import { GoogleSheet } from '../info/google_sheet'
import discord from 'discord.js'

export type Item = {
  name: string;
  description: string;
  type: string;
  weight: string;
  value: string;
  rarity: string;
};

export class ItemsCommand implements Command {
  commandNames = ['items', 'item'];
  sheetName = 'Items';

  getHelpMessage(commandPrefix: string): string {
    return `Use ${commandPrefix}item [item name] to get a item description.`;
  }

  async run(parsedUserCommand: CommandContext): Promise<void> {

    if (parsedUserCommand.args.length === 0) {
      await parsedUserCommand.originalMessage.channel.send('Please insert a name for the item you are looking for');
    } else if (parsedUserCommand.args.length >= 10) {
      await parsedUserCommand.originalMessage.channel.send('Im pretty sure this is not an item. Please try another argument.');
    } else {
      let itemName = this.parseArguments(parsedUserCommand.args);

      let item = await this.getObjectFromSheet(itemName);

      if (item.name === undefined) {
        await parsedUserCommand.originalMessage.channel.send(`Could not find an item with the name ${itemName}. Either the item does not exists or please check if it is correctly written.`);
      } else {
        let message = await this.embeddedPost(item);
        await parsedUserCommand.originalMessage.channel.send(message);
      }
    }

  }

  hasPermissionToRun(parsedUserCommand: CommandContext): boolean {
    return true;
  }

  parseArguments(arg: string[]): string {
    let itemName = arg.join(' ').toLowerCase();
    return itemName;
  }

  async getObjectFromSheet(itemName: string): Promise<Item> {
    const sheet = new GoogleSheet();

    let result = await sheet.getObject(this.sheetName, itemName);

    let objProp = result.reduce((prop, row) => {
      if (row[0].toLowerCase() === itemName) {
        return prop.concat(row);
      } else {
        return prop;
      }
    }, []);

    let itemInfo: Item = {
      name: objProp[0],
      description: objProp[4],
      type: objProp[1],
      weight: objProp[2],
      value: objProp[3],
      rarity: objProp[6],
    }

    return itemInfo;
  }

  async embeddedPost(item: Item): Promise<any> {
    const exampleEmbed = new discord.MessageEmbed()
      .setColor(config.color)
      .setTitle(item.name)
      .setAuthor(config.name, config.logo, config.website)
      .setDescription(item.description)
      .addFields(
        { name: 'Type', value: item.type, inline: true },
        { name: 'Weight', value: item.weight, inline: true },
        { name: 'Base Value', value: item.value, inline: true },
        { name: 'Rarity', value: item.rarity, inline: true },
      )

    return exampleEmbed
  }

}