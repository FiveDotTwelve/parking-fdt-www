import { App } from '@slack/bolt';
import { LoginParkingHandler } from './handlers/loginParking';
import { ListParkingHandler } from './handlers/listParking';
import { ReserveParkingHandler } from './handlers/reserveParking';
import { ShowParkingHandler } from './handlers/showParking';

export function Parking(app: App) {
  app.command('/parking', async ({ command, ack, respond, client }) => {
    await ack();

    const [action = '', target = ''] = command.text?.trim().split(' ') || [];

    switch (action) {
      case 'login':
        await LoginParkingHandler(command.user_id, command.user_name, respond)
        break;
      case 'list':
        await ListParkingHandler(respond);
        break;
      case 'reserve':
        await ReserveParkingHandler(command.user_id, client, command.trigger_id, respond);
        break;
      case 'show':
        await ShowParkingHandler(target, command.user_id, respond);
        break;
      default:
        await respond({
          response_type: 'ephemeral',
          text: 'Unknown command. Try `/parking list`.',
        });
        break;
    }
  });
}
