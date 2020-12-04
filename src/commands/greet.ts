import { CommandContext } from '../models/command_context';
import { Command } from './commands';

export class GreetCommand implements Command {
  commandNames = ['greet', 'hello'];

  getHelpMessage(commandPrefix: string): string {
    return `Use ${commandPrefix}greet to get a greeting.`;
  }

  async run(parsedUserCommand: CommandContext): Promise<void> {
    await parsedUserCommand.originalMessage.reply(`Yes, I'm alive. But the writer of this bot never properly greets anyone... So do you expect me to? `);
  }

  hasPermissionToRun(parsedUserCommand: CommandContext): boolean {
    return true;
  }
}