"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const browser_1 = require("./browser");
const _1337x_1 = require("./1337x");
describe('kat torrents', () => {
    afterAll(async () => {
        return await browser_1.close();
    });
    test('search', async () => {
        const results = await _1337x_1.search('robot', 1);
        expect(results.length).toBeTruthy();
        const result = results[0];
        console.log('kat search result', result);
        expect(result.path).toBeTruthy();
        expect(result.name).toBeTruthy();
        expect(result.size).toBeTruthy();
        expect(result.seeds).toBeTruthy();
        expect(result.leeches).toBeTruthy();
        expect(result.uploader).toBeTruthy();
        expect(result.source).toBeTruthy();
        return true;
    }, 10 * 1000);
    test('details', async () => {
        let result = await _1337x_1.details('http://1337x.to/torrent/2295100/Transformers-The-Last-Knight-2017-HD-TC-720P-RUS/');
        console.log('kat details result', result);
        expect(result.name).toBeTruthy();
        expect(result.magnet).toBeTruthy();
        expect(result.source).toBeTruthy();
        return true;
    }, 10 * 1000);
});
//# sourceMappingURL=1337x.test.js.map