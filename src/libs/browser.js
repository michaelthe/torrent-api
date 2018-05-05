"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = require("puppeteer");
const path_1 = require("path");
// const extensions = resolve(__dirname, 'extensions/ublock')
let debug = false;
let browser = puppeteer_1.launch({
    dumpio: false,
    args: [
    // '--disable-extensions-except=' + extensions,
    // '--load-extension=' + extensions,
    ],
    devtools: debug,
    headless: !debug,
    ignoreHTTPSErrors: true,
    userDataDir: path_1.resolve(__dirname, '../../chrome-user')
    // userDataDir: resolve(__dirname, '../../chrome-users/', v4())
});
async function newPage() {
    return await (await browser).newPage();
}
exports.newPage = newPage;
async function close() {
    return await (await browser).close();
}
exports.close = close;
//# sourceMappingURL=browser.js.map