import express from 'express';
import {WebSocketServer} from 'ws';

export default function (app_port = 80, wss_port = 8080) {
    console.info('Initializing WSS server...');
    const wss = new WebSocketServer({port: wss_port});

    console.info(`Adding WSS listeners (wss://localhost:${wss_port})...`);
    let clients = [];
    wss.on('connection', function (ws) {
        ws.on('error', console.error);

        ws.on('message', function message(data) {
            console.log('received: %s', data);
        });
        ws.on('close', function message() {
            const index = clients.indexOf(ws);
            clients.splice(index, 1); // Remove element at index
        });

        clients.push(ws);
    });

    console.info(`Initializing Web server (http://localhost:${app_port})...`);
    const app = express();

    app.use(express.json());

    const callback = (req, res) => {
        for (const client of clients)
            client.send(
                JSON.stringify({
                    method: req.method,
                    protocol: req.protocol,
                    hostname: req.hostname,
                    query: req.query,
                    url: req.url,
                    path: req.path,
                    body: req.body
                })
            );

        res.status(200).send('ok');
    };

    app.get('*', callback);
    app.post('*', callback);

    console.info('Starting to listen for Web server...');
    app.listen(app_port, () => {
        console.info('Web server ready.');
    });
};
