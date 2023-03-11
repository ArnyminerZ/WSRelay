import WebSocket from 'ws';
import http from 'http';

import server from '../src/server.mjs';
import * as assert from 'assert';

console.info('>>> Starting server... <<<');
server(3000, 3001);

console.info('>>> Launching tests... <<<');
const ws = new WebSocket('ws://localhost:3001/path');

ws.on('error', console.error);

ws.on('open', function open() {
    console.info('Socket is open.');
});

ws.on('message', function message(data) {
    const json = JSON.parse(data);
    console.log('Data:', json);

    assert.equal(json.method, 'GET');
    assert.equal(json.path, '/test');
    assert.deepEqual(json.query, { key: 'value' });

    console.info('>>> Tests passed! <<<');
    ws.close();
    process.exit(1);
});

http.get('http://localhost:3000/test?key=value', {}, function (res) {
    console.info('Sent request!');
});
