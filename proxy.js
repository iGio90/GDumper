'use strict';
require('console-stamp')(console, 'yyyy-mm-dd HH:MM:ss');

const net = require('net');
const jsome = require('jsome');

const Crypto = require('./scripts/crypto');
const PacketReceiver = require('./scripts/packetreceiver');
const Definitions = require('./scripts/definitions');
const EMsg = require('./scripts/emsg');

/**
 * Game Map
 * 0: bb
 * 1: coc
 * 2: cr
 */
const definitions = new Definitions(1);
const clients = {};
const server = net.createServer();
const packetReceiver = new PacketReceiver();
const crypto = new Crypto();

let OTG = false;

function packetize(data, isOutgoing) {
    console.log("GET: " + isOutgoing + " " + data.toString("hex").substring(0, 14));
    console.log(data.length);
    if (isOutgoing !== null) {
        OTG = isOutgoing;
    }

    packetReceiver.packetize(data, function(packet) {
        let message = {
            'messageType': packet.readUInt16BE(0),
            'length': packet.readUIntBE(2, 3),
            'version': packet.readUInt16BE(5),
            'payload': packet.slice(7, packet.length)
        };

        console.log((OTG ? '[CLIENT] ' : '[SERVER] ')
            + (EMsg[message.messageType] ? EMsg[message.messageType] +
                ' [' + message.messageType + ']' : message.messageType));

        crypto.decrypt(message, OTG);
        if (message.decrypted.length > 0) {
            definitions.decode(message);

            if (message.decoded && Object.keys(message.decoded).length) {
                jsome(message.decoded);
            }
        }
    });
}
server.on('error', function(err) {
    if (err.code === 'EADDRINUSE') {
        console.log('Address in use, exiting...');
    } else {
        console.log('Unknown error setting up proxy: ' + err);
    }

    process.exit(1);
});

server.on('listening', function() {
    console.log('listening on ' + server.address().address + ':' + server.address().port);
});

server.on('connection', function(socket) {
    socket.key = socket.remoteAddress + ":" + socket.remotePort;
    clients[socket.key] = socket;

    console.log('new client ' + socket.key + ' connected, establishing connection to game server');

    clients[socket.key].on('data', function(chunk) {
        let data = chunk.toString("UTF8");
        data = data.split("::::");
        if (data.length > 1) {
            switch (data[0]) {
                case "0":
                    crypto.setPublicKey(new Buffer(data[1], "hex"));
                    return;
                case "1":
                    crypto.setPrivateKey(new Buffer(data[1], "hex"));
                    return;
                case "2":
                    crypto.setPublicServerKey(new Buffer(data[1], "hex"));
                    return;
            }

            let isOutgoing = data[0] === "3";
            let message = new Buffer(data[1], "hex");

            packetize(message, isOutgoing)
        } else {
            packetize(new Buffer(chunk, "hex"), null)
        }
    });

    clients[socket.key].on('end', function() {
        console.log('Client ' + socket.key + ' disconnected from proxy.');
        delete clients[socket.key];
    });
});

server.listen({ host: '0.0.0.0', port: 10101, exclusive: true }, function(err) {
    if (err) {
        console.log(err);
    }
});
