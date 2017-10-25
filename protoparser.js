'use strict';
require('console-stamp')(console, 'yyyy-mm-dd HH:MM:ss');

const net = require('net');
const jsome = require('jsome');
const fs = require('fs');
const path = require('path');

const Crypto = require('./scripts/crypto');
const PacketReceiver = require('./scripts/packetreceiver');
const Definitions = require('./scripts/definitions');
const EMsg = require('./scripts/emsg');

if (process.argv.length < 3) {
    console.log("Usage: node protoparser.js dumpspath");
    process.exit(0);
}

let filePath = process.argv[2];

if (!fs.existsSync(filePath)) {
    console.log("Path not found!");
    process.exit(0);
}

/**
 * Game Map
 * 0: bb
 * 1: coc
 * 2: cr
 */
const definitions = new Definitions(1);
const packetReceiver = new PacketReceiver();
const crypto = new Crypto();

let dumpsList = [];
let dumpsIter = 0;

function readDump(iter) {
    if (iter > dumpsList.length - 1 || iter < 0 || dumpsList.length < 1) {
        console.log("No more dumps to read.");
        process.exit(0);
        return;
    }
    let path = dumpsList[iter];
    dumpsIter = iter;
    let dump = fs.readFileSync(filePath + path, 'utf8');
    dumpsIter++;

    packetReceiver.packetize(new Buffer(dump, "hex"), function(packet) {
        let message = {
            'messageType': packet.readUInt16BE(0),
            'length': packet.readUIntBE(2, 3),
            'version': packet.readUInt16BE(5),
            'payload': packet.slice(7, packet.length)
        };

        let out = path.indexOf("_client_") > 0;
        console.log((out ? '[CLIENT] ' : '[SERVER] ')
            + (EMsg[message.messageType] ? EMsg[message.messageType] +
                ' [' + message.messageType + ']' : message.messageType));

        crypto.decrypt(message, out);
        if (message.decrypted.length > 0) {
            definitions.decode(message);

            if (message.decoded && Object.keys(message.decoded).length) {
                jsome(message.decoded);
            }

            console.log('Press any key to parse the next message.');
            process.stdin.once('data', function () {
                readDump(dumpsIter);
            });
        } else {
            console.log("Unable to decrypt message");
            process.exit(0);
        }
    });
}

let sortDumps = function (a, b)    {
    a = a.toLowerCase();
    b = b.toLowerCase();
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
};

setTimeout(function () {
    let dumps = fs.readdirSync(filePath);
    dumps.pop("pk.bin");
    dumps.pop("sk.bin");
    dumps.pop("psk.bin");

    let pk = fs.readFileSync(filePath + "pk.bin", "utf8");
    let sk = fs.readFileSync(filePath + "sk.bin", "utf8");
    let psk = fs.readFileSync(filePath + "pks.bin", "utf8");

    crypto.setPublicKey(new Buffer(pk, "hex"));
    crypto.setPrivateKey(new Buffer(sk, "hex"));
    crypto.setPublicServerKey(new Buffer(psk, "hex"));

    dumps.sort(sortDumps);
    dumpsList = dumps;

    readDump(0)
}, 1000); // Give time to load definitions
