import {PutEventsCommand} from '@aws-sdk/client-eventbridge';
import {EVENT_BUS_NAME, events} from '../src/aws';


async function main() {
    const res = await events.send(new PutEventsCommand({
        Entries: [
            {
                Source: 'app.example',
                DetailType: 'user.created',
                Detail: JSON.stringify({userId: 'u-123', email: 'john@doe.io'}),
                EventBusName: EVENT_BUS_NAME
            }
        ]
    }));
    console.log('Seeded events:', JSON.stringify(res, null, 2));
}


main().catch((e) => {
    console.error(e);
    process.exit(1);
});
