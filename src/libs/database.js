"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const levelup_1 = __importDefault(require("levelup"));
const leveldown_1 = __importDefault(require("leveldown"));
let _db;
async function databse() {
    if (_db) {
        return _db;
    }
    _db = await levelup_1.default(leveldown_1.default(path_1.resolve(__dirname, '../database')));
    return _db;
}
async function set(key, value) {
    let db = await databse();
    try {
        value = JSON.stringify(value);
    }
    catch (e) {
    }
    return await db.put(key, value);
}
exports.set = set;
async function get(key) {
    let db = await databse();
    let value = null;
    try {
        value = await db.get(key);
    }
    catch (e) {
        console.log(`key: ${key} does not exist`);
    }
    try {
        value = JSON.parse(value);
    }
    catch (e) {
        console.log(`can not parse key: ${key} value: ${value}`);
    }
    return value;
}
exports.get = get;
exports.default = { set, get };
//# sourceMappingURL=database.js.map