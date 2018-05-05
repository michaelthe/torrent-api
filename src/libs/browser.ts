import {v4} from 'uuid'
import {launch} from 'puppeteer'
import {resolve} from 'path'

// const extensions = resolve(__dirname, 'extensions/ublock')

let debug = false
let browser = launch({
    dumpio: false,
    args: [
        // '--disable-extensions-except=' + extensions,
        // '--load-extension=' + extensions,
    ],
    devtools: debug,
    headless: !debug,
    ignoreHTTPSErrors: true,
    userDataDir: resolve(__dirname, '../../chrome-user')
    // userDataDir: resolve(__dirname, '../../chrome-users/', v4())
})

export async function newPage() {
    return await (await browser).newPage()
}

export async function close() {
    return await (await browser).close()
}
