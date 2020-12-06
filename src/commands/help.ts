import { CommandContext } from '../models/command_context';
import { Command } from './commands';
import { config } from '../config/config';
import discord from 'discord.js';

export class HelpCommand implements Command {
  readonly commandNames = ['help', 'halp', 'hlep'];

  private commands: Command[];

  constructor(commands: Command[]) {
    this.commands = commands;
  }

  async run(commandContext: CommandContext): Promise<void> {
    const allowedCommands = this.commands.filter((command) =>
      command.hasPermissionToRun(commandContext),
    );

    if (commandContext.args.length === 0) {
      const commandNames = allowedCommands.map(
        (command) => command.commandNames[0],
      );
      // TODO: Make this a fancy embed
      await commandContext.originalMessage.reply(
        `here is a list of commands you can run: ${commandNames.join(
          ' ',
        )}. Try !help ${commandNames[0]} to learn more about one of them.` +
          '\nVersion: 0.1 \nFor more information check out: https://github.com/Rachelledezwart/Discord_bot',
      );

      
      // const devID = '436577130583949315';
      // const client = new discord.Client();
      // const dev = await client.fetchUser(devID);

      // const helpmsg = new discord.MessageEmbed()
      // .setColor(config.color)
      // .setTitle('!help command')
      // .setAuthor('Eleanorian', 'http://www.thelandrpg.com/wp-content/uploads/2020/12/bot-logo.png', 'https://github.com/Rachelledezwart/Discord_bot')
      // .setDescription('Eleanorian was build to help The Land RPG fan project. ')
      // .setThumbnail('http://www.thelandrpg.com/wp-content/uploads/2020/12/bot-logo.png')
      // // .addFields(
      // //   { name: 'here is a list of commands you can run:', value: `${commandNames.join(' ',)}` },
      // //   { name: 'For more information on eac', value: `${commandNames.join(' ',)}` },
      // // )
      // .setTimestamp()
      // .setFooter('Some footer text here');

      // commandContext.originalMessage.channel.send(helpmsg);

      return;
    }

    const matchedCommand = this.commands.find((command) =>
      command.commandNames.includes(commandContext.args[0]),
    );
    if (!matchedCommand) {
      await commandContext.originalMessage.reply(
        "I don't know about that command :(. Try !help to find all commands you can use.",
      );
      throw Error('Unrecognized command');
    }
    if (allowedCommands.includes(matchedCommand)) {
      await commandContext.originalMessage.reply(
        this.buildHelpMessageForCommand(matchedCommand, commandContext),
      );
    }
  }

  private buildHelpMessageForCommand(
    command: Command,
    context: CommandContext,
  ): string {
    return `${command.getHelpMessage(
      context.commandPrefix,
    )}\nCommand aliases: ${command.commandNames.join(', ')}`;
  }

  hasPermissionToRun(commandContext: CommandContext): boolean {
    return true;
  }

  getHelpMessage(commandPrefix: string) {
    return 'I think you already know how to use this command...';
  }
}