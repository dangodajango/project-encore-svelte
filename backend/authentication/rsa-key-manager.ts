import fs from "fs";

let privateKey: string;
let publicKey: string;

fs.readFile("./rsa-keys/privateKey.pem", "utf8", (err, key) => {
    if (err) {
        console.error("Could not load private key", err);
        return;
    }
    console.log("Successfully loaded the private key");
    privateKey = key;
})

fs.readFile("./rsa-keys/publicKey.pem", "utf8", (err, key) => {
    if (err) {
        console.error("Could not load public key", err);
        return;
    }
    console.log("Successfully loaded the public key");
    publicKey = key;
})

export function getPrivateKey() {
    if (!privateKey) {
        throw new Error("Private key is not loaded");
    }
    return privateKey;
}

export function getPublicKey() {
    if (!publicKey) {
        throw new Error("Public key is not loaded");
    }
    return publicKey;
}