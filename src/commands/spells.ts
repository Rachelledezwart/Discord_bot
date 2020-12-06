import { CommandContext } from '../models/command_context';
import { Command } from './commands';
import { config } from '../config/config';
import { GoogleSheet } from '../info/google_sheet'
import discord from 'discord.js'

export type Spell = {
  name: string;
  description: string;
  type: string;
  action: string;
  damage: string;
  defense: string;
  mana: string;
  target: string;
  cooldown: string;
  rank: string;
};

export class SpellsCommand implements Command {
  commandNames = ['spells', 'spell'];
  sheetName = 'spells';

  getHelpMessage(commandPrefix: string): string {
    return `Use ${commandPrefix}spell [spell name] to get a spell description.`;
  }

  async run(parsedUserCommand: CommandContext): Promise<void> {

    if (parsedUserCommand.args.length === 0) {
      await parsedUserCommand.originalMessage.channel.send('Please insert a name for the spell you are looking for');
    } else if (parsedUserCommand.args.length >= 10) {
      await parsedUserCommand.originalMessage.channel.send('Im pretty sure this is not an spell. Please try another argument.');
    } else {
      let spellName = this.parseArguments(parsedUserCommand.args);

      let spell = await this.getObjectFromSheet(spellName);

      if (spell.name === undefined) {
        await parsedUserCommand.originalMessage.channel.send(`Could not find an spell with the name ${spellName}. Either the spell does not exists or please check if it is correctly written.`);
      } else {
        let message = await this.embeddedPost(spell);
        await parsedUserCommand.originalMessage.channel.send(message);
      }
    }

  }

  hasPermissionToRun(parsedUserCommand: CommandContext): boolean {
    return true;
  }

  parseArguments(arg: string[]): string {
    const spellPrefix = 'spell: ';

    let spellName = arg.join(' ').toLowerCase();

    if (spellName.includes(spellPrefix)) {
    } else {
        spellName = spellPrefix.concat(spellName);
    }
    return spellName;
  }

  async getObjectFromSheet(spellName: string): Promise<Spell> {
    const sheet = new GoogleSheet();

    let result = await sheet.getObject(this.sheetName);
    console.log(result)
    let objProp = result.reduce((prop, row) => {
      if (row[0].toLowerCase() === spellName) {
        return prop.concat(row);
      } else {
        return prop;
      }
    }, []);

    let spellInfo: Spell = {
      name: objProp[0],
      description: objProp[10],
      type: objProp[1],
      action: objProp[2],
      damage: objProp[3],
      defense: objProp[5],
      mana: objProp[6],
      target: objProp[7],
      cooldown: objProp[8],
      rank: objProp[9],
    }

    console.log(spellInfo);

    return spellInfo;
  }

  async embeddedPost(spell: Spell): Promise<any> {
    const exampleEmbed = new discord.MessageEmbed()
      .setColor(config.color)
      .setTitle(spell.name)
      .setAuthor(config.name, config.logo, config.website)
      .setDescription(spell.description)
      .addFields(
        { name: 'Type', value: spell.type, inline: true },
        { name: 'Action', value: spell.action, inline: true },
        { name: 'Damage die', value: spell.damage, inline: true },
        { name: 'Defense', value: spell.defense, inline: true },
        { name: 'Mana', value: spell.mana, inline: true },
        { name: 'Target', value: spell.target, inline: true },
        { name: 'Cooldown', value: spell.cooldown, inline: true },
        { name: 'Rank', value: spell.rank, inline: true },
      )

    return exampleEmbed
  }

}