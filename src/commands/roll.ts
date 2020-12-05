import { CommandContext } from '../models/command_context';
import { Command } from './commands';

export class RollCommand implements Command {
    commandNames = ['roll', 'dice', 'die'];

    getHelpMessage(commandPrefix: string): string {
        return `Use ${commandPrefix}roll to roll a dice. Add in for example "1d10" to roll a specific dice. Otherwise the default roll will be a 1D100`;
    }

    async run(parsedUserCommand: CommandContext): Promise<void> {
        try {
            // TODO: More user input checks...
            // TODO: Refactor this code...

            let die = 100;
            let rolls = 1;

            console.log(parsedUserCommand.args);

            if (parsedUserCommand.args.length > 0) {
                let arr = parsedUserCommand.args[0].split('d')

                console.log(arr[0])

                if (isNaN(Number(arr[0])) && isNaN(Number(arr[1]))) {
                    throw "Please use the correct dice format. Example: '1D20'"
                }

                // Amount of Die
                rolls = !arr[0] ? 1 : Number(arr[0]);
                //Die type
                die = !arr[1] ? 100 : Number(arr[1]);
            }

            let results = [];

            for (let i = 0; i < rolls; i++) {
                results.push(this.getDiceRoll(die));
            }

            let result = results.toString();

            let response = rolls === 1 ? `You rolled a **${result}**` : `You rolled **${result}** with a total of: **${results.reduce((a, b) => a + b, 0)}**`

            await parsedUserCommand.originalMessage.channel.send(response);

        } catch (e) {
            await parsedUserCommand.originalMessage.channel.send(e);
            console.log(e);
        }
    }

    getDiceRoll(roll: number): number {
        let num = Math.floor(Math.random() * roll) + 1;
        return num;
    }

    hasPermissionToRun(parsedUserCommand: CommandContext): boolean {
        return true;
    }
}