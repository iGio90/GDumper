'use strict';

const nacl = require("tweetnacl");
const Nonce = require("./nonce");
const EMsg = require('./emsg');

class Crypto {
    constructor() {
        this.publicKey = null;
        this.privateKey = null;
        this.publicServerKey = null;
        this.decryptOutNonce = null;
        this.decryptInNonce = null;
        this.sharedKey = null;
    }

    setPublicKey(publicKey) {
        this.publicKey = publicKey;
    }

    setPrivateKey(privateKey) {
        this.privateKey = privateKey;
    }

    setPublicServerKey(publicServerKey) {
        this.publicServerKey = publicServerKey;
    }

    getDecryptOutNonce() {
        return this.decryptOutNonce;
    }

    setDecryptOutNonce(nonce) {
        this.decryptOutNonce = new Nonce({ nonce: nonce });
    }

    getDecryptInNonce() {
        return this.decryptInNonce;
    }

    setDecryptInNonce(nonce) {
        this.decryptInNonce = new Nonce({ nonce: nonce });
    }

    setSharedKey(sharedKey) {
        this.sharedKey = sharedKey;
    }

    decrypt(message, out) {
        if (message.messageType === EMsg.Login) {
            let cipherText = message.payload.slice(32);
            let sharedKey = new Buffer(nacl.box.before(this.privateKey, this.publicServerKey));
            let nonce = new Nonce({ clientKey: this.publicKey, serverKey: this.publicServerKey });

            message.decrypted = nacl.box.open.after(cipherText, nonce.getBuffer(), sharedKey);

            if (message.decrypted) {
                this.setDecryptOutNonce(Buffer.from(message.decrypted.slice(24, 48)));
                message.decrypted = message.decrypted.slice(48);
            }
        } else if (message.messageType === EMsg.LoginOk) {
            let nonce = new Nonce({ clientKey: this.publicKey, serverKey: this.publicServerKey, nonce: this.decryptOutNonce });

            let sharedKey = new Buffer(nacl.box.before(this.privateKey, this.publicServerKey));
            message.decrypted = nacl.box.open.after(message.payload, nonce, sharedKey);

            if (message.decrypted) {
                this.setDecryptInNonce(Buffer.from(message.decrypted.slice(0, 24)));
                this.setSharedKey(Buffer.from(message.decrypted.slice(24, 56)));
                message.decrypted = message.decrypted.slice(56);
            }
        } else {
            if (out) {
                this.decryptOutNonce.increment();
                message.decrypted = nacl.box.open.after(message.payload, this.decryptOutNonce, this.sharedKey);
            } else {
                this.decryptInNonce.increment();
                message.decrypted = nacl.box.open.after(message.payload, this.decryptInNonce, this.sharedKey);
            }
        }
    }
}

module.exports = Crypto;
