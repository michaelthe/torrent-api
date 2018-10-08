"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const crypto_1 = require("crypto");
const database_1 = __importDefault(require("./database"));
const fs_chunk_store_1 = __importDefault(require("fs-chunk-store"));
const WebTorrent = require('webtorrent');
const client = new WebTorrent();
const dataPath = path_1.resolve(__dirname, 'client-data');
client.on('error', (error) => console.error('WebTorrent: client error: ', error.message));
client.on('torrent', async (torrent) => {
    let old = await database_1.default.get('active-torrent') || [];
    console.log({ old });
    let added = old.concat(torrent.infoHash);
    console.log({ added });
    let filtered = added.filter((v, i, a) => a.indexOf(v) === i);
    console.log({ filtered });
    await database_1.default.set('active-torrent', filtered);
    console.log('WebTorrent: torrent added: ', { hash: torrent.infoHash });
});
async function addTorrent(magnet) {
    let hash = _parseMagnet(magnet);
    console.log(hash);
    let old = client.torrents.find(torrent => torrent.infoHash === hash);
    if (old) {
        return hash;
    }
    hash = await new Promise(resolve => client.add(magnet, {
        path: dataPath,
        store: fs_chunk_store_1.default
    }, (torrent) => resolve(torrent.infoHash)));
    return hash;
}
exports.addTorrent = addTorrent;
async function getTorrent(magnet) {
    let hash = await addTorrent(magnet);
    return getTorrents().find(torrent => torrent.hash === hash);
}
exports.getTorrent = getTorrent;
async function getFile(hash, fileId) {
    let torrent = await getTorrent(hash);
    return torrent.files.find(file => file.id === fileId);
}
exports.getFile = getFile;
function getTorrents() {
    return client.torrents
        .map(torrent => {
        let hash = torrent.infoHash;
        let files = torrent.files.map(file => ({ name: file.name, id: _hashString(file.name) }));
        let status = {
            upload: (torrent.uploadSpeed / 1000).toFixed(2) + ' Kb/s',
            download: (torrent.downloadSpeed / 1000).toFixed(2) + ' Kb/s',
            progress: (torrent.progress * 100).toFixed(2) + ' %'
        };
        return { hash, files, status };
    });
}
exports.getTorrents = getTorrents;
function getStatus() {
    return {
        upload: (client.uploadSpeed / 1000).toFixed(2) + ' Kb/s',
        download: (client.downloadSpeed / 1000).toFixed(2) + ' Kb/s',
        progress: (client.progress * 100).toFixed(2) + ' %'
    };
}
exports.getStatus = getStatus;
async function loadTorrents() {
    let torrents = await database_1.default.get('active-torrent');
    console.log('restarting torrents', torrents);
    for (let torrent of (torrents || [])) {
        await client.add(torrent);
    }
}
exports.loadTorrents = loadTorrents;
function _parseMagnet(magnet) {
    let parts = magnet.split('btih:');
    let hash = parts.length > 1
        ? parts.slice(1).shift().split('&').shift()
        : parts.shift();
    return hash.toLowerCase();
}
function _hashString(string) {
    const hash = crypto_1.createHash('sha256');
    hash.update(string);
    return hash.digest('hex');
}
//# sourceMappingURL=client.js.map