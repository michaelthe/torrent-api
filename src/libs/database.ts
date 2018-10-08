import {resolve} from 'path'
import levelup from 'levelup'
import leveldown from 'leveldown'

let _db

async function databse() {
    if (_db) {
        return _db
    }
    _db = await levelup(leveldown(resolve(__dirname, '../database')))

    return _db
}

export async function set(key, value) {
    let db = await databse()
    try {
        value = JSON.stringify(value)
    } catch (e) {
    }

    return await db.put(key, value)
}

export async function get(key) {
    let db = await databse()
    let value = null

    try {
        value = await db.get(key)
    } catch (e) {
        console.log(`key: ${key} does not exist`)
    }

    try {
        value = JSON.parse(value)
    } catch (e) {
        console.log(`can not parse key: ${key} value: ${value}`)
    }

    return value
}

export default {set, get}
