import WebSocket from 'ws';
import https from 'https';

import * as assert from 'assert';

console.info('>>> Launching tests... <<<');
const ws = new WebSocket('ws://wsrelay-ws.arnyminerz.com');

ws.on('error', console.error);

ws.on('open', function open() {
    console.info('Socket is open.');
});

ws.on('message', function message(data) {
    const json = JSON.parse(data);
    console.log('Data:', json);

    assert.equal(json.method, 'GET');
    assert.equal(json.path, '/testing');
    assert.deepEqual(json.query, { key: 'value' });

    console.info('>>> Tests passed! <<<');
    ws.close();
    process.exit(0);
});

https.get('https://wsrelay.arnyminerz.com/testing?key=value', {}, function () {
    console.info('Sent request!');
});
