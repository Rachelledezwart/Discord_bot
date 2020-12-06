import { Message } from 'discord.js'
import { Command } from './commands';
import { HelpCommand } from './help';
import { CommandContext } from '../models/command_context';
import { reactor } from '../reactions/reactor';

import { GreetCommand } from './greet';
import { RollCommand } from './roll';
import { ItemsCommand } from './items';
import { SpellsCommand } from './spells';

export class CommandHandler {
    private commands: Command[];

    private readonly prefix: string;

    constructor(prefix: string) {
        const commandClasses: any[] = [
            // TODO: Add more classes
            GreetCommand,
            RollCommand,
            ItemsCommand,
            SpellsCommand,
        ];

        this.commands = commandClasses.map((CommandClass) => new CommandClass());
        this.commands.push(new HelpCommand(this.commands));
        this.prefix = prefix;
    }

    async handleMessage(msg: Message): Promise<void>{
        if (msg.author.bot || !this.isCommand(msg)) {
            return;
        }

        const commandContext = new CommandContext(msg, this.prefix);

        const allowedCommands = this.commands.filter((command) =>
          command.hasPermissionToRun(commandContext),
        );
        const matchedCommand = this.commands.find((command) =>
          command.commandNames.includes(commandContext.parsedCommandName),
        );

        if (!matchedCommand) {
            await msg.reply("I don't recognize that command. Try !help.");
            await reactor.failure(msg);
          } else if (!allowedCommands.includes(matchedCommand)) {
            await msg.reply("you aren't allowed to use that command. Try !help.");
            await reactor.failure(msg);
          } else {
            await matchedCommand
              .run(commandContext)
              .then(() => {
                reactor.success(msg);
              })
              .catch((reason) => {
                reactor.failure(msg);
              });
          }
    }

    private isCommand(msg: Message): boolean {
        return msg.content.startsWith(this.prefix);
    }
}