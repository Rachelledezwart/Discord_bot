import { CommandContext } from '../models/command_context';
import { Command } from './commands';

export class RollCommand implements Command {
  commandNames = ['roll'];

  getHelpMessage(commandPrefix: string): string {
    return `Use ${commandPrefix}roll to roll a dice.`;
  }

  async run(parsedUserCommand: CommandContext): Promise<void> {
    // TODO: add different dice
    // TODO: add color styling for nat 1 or 100

    console.log(parsedUserCommand);

    let result = this.getDiceRoll();

    await parsedUserCommand.originalMessage.channel.send(`You rolled a ${result}`);
  }

  getDiceRoll(): Number {
      let num = Math.floor(Math.random() * 100) + 1;
      return num;
  }

  hasPermissionToRun(parsedUserCommand: CommandContext): boolean {
    return true;
  }
}