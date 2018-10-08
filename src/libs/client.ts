import {resolve} from 'path'
import {createHash} from 'crypto'

import database from './database'
import FSChunkStore from 'fs-chunk-store'

const WebTorrent = require('webtorrent')

const client = new WebTorrent()
const dataPath = resolve(__dirname, 'client-data')

client.on('error', (error: any) => console.error('WebTorrent: client error: ', error.message))

client.on('torrent', async torrent => {
    let old: string[] = await database.get('active-torrent') || []

    console.log({old})

    let added: string[] = old.concat(torrent.infoHash)

    console.log({added})

    let filtered: string[] = added.filter((v, i, a) => a.indexOf(v) === i)

    console.log({filtered})

    await database.set('active-torrent', filtered)

    console.log('WebTorrent: torrent added: ', {hash: torrent.infoHash})
})

export async function addTorrent(magnet) {
    let hash = _parseMagnet(magnet)

    console.log(hash)
    let old = client.torrents.find(torrent => torrent.infoHash === hash)

    if (old) {
        return hash
    }

    const options = {path: dataPath, store: FSChunkStore}

    hash = await new Promise(resolve => client.add(magnet, options, (torrent: any) => resolve(torrent.infoHash)))

    return hash
}

export async function getTorrent(magnet) {
    let hash = await addTorrent(magnet)
    return getTorrents().find(torrent => torrent.hash === hash)
}

export async function getFile(hash, fileId) {
    let torrent = await getTorrent(hash)
    return torrent.files.find(file => file.id === fileId)
}

export function getTorrents() {
    return client.torrents
        .map(torrent => {
            let hash = torrent.infoHash
            let files = torrent.files.map(file => ({name: file.name, id: _hashString(file.name)}))
            let status = {
                upload: (torrent.uploadSpeed / 1000).toFixed(2) + ' Kb/s',
                download: (torrent.downloadSpeed / 1000).toFixed(2) + ' Kb/s',
                progress: (torrent.progress * 100).toFixed(2) + ' %'
            }

            return {hash, files, status}
        })
}

export function getStatus() {
    return {
        upload: (client.uploadSpeed / 1000).toFixed(2) + ' Kb/s',
        download: (client.downloadSpeed / 1000).toFixed(2) + ' Kb/s',
        progress: (client.progress * 100).toFixed(2) + ' %'
    }
}

export async function loadTorrents() {
    let torrents = await database.get('active-torrent')
    console.log('restarting torrents', torrents)

    for (let torrent of (torrents || [])) {
        await addTorrent(torrent)
    }
}


function _parseMagnet(magnet) {
    let parts = magnet.split('btih:')

    let hash = parts.length > 1
        ? parts.slice(1).shift().split('&').shift()
        : parts.shift()

    return hash.toLowerCase()
}

function _hashString(string) {
    const hash = createHash('sha256')
    hash.update(string)
    return hash.digest('hex')
}
