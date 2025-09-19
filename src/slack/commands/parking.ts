import { App } from '@slack/bolt';
import { LoginParking } from './handlers/loginParking';
import { HelpParking } from './handlers/helpParking';
import { ReserveParking } from './handlers/reserveParking';
import { CancelParking } from './handlers/cancelParking';
import { ShowParking } from './handlers/showParking';

export function ParkingCommand(app: App) {
  app.command('/parking', async ({ command, ack, respond, client }) => {
    await ack();

    const [action = '', target = ''] = command.text?.trim().split(' ') || [];

    switch (action) {
      case 'login':
        await LoginParking(command.user_id, command.user_name, respond);
        break;
      case 'help':
        await HelpParking(respond);
        break;
      case 'reserve':
        await ReserveParking(command.user_id, client, command.trigger_id, respond);
        break;
      case 'cancel':
        await CancelParking(command.user_id, client, command.trigger_id, respond);
        break;
      case 'show':
        await ShowParking(target, command, command.user_id, respond);
        break;
      default:
        await respond({
          response_type: 'ephemeral',
          text: 'Unknown command. Try `/parking help`.',
        });
        break;
    }
  });
}
