"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bytes_1 = require("bytes");
const browser_1 = require("./browser");
async function details(path) {
    let page = await browser_1.newPage();
    await page.setViewport({ width: 1024, height: 1024 });
    await page.setRequestInterception(true);
    page.on('request', interceptedRequest => {
        if (interceptedRequest.url().match(/adv/i) || interceptedRequest.url().match(/css/i))
            interceptedRequest.abort();
        else
            interceptedRequest.continue();
    });
    await page.goto(path);
    let details = await page
        .evaluate(() => {
        let magnet = $('a').filter(function () {
            return $(this).html().match(/magnet download/i);
        }).attr('href');
        return {
            name: $('h1').html().trim(),
            magnet: magnet,
            source: '1337x'
        };
    });
    page.close();
    return details;
}
exports.details = details;
async function search(q, p) {
    let page = await browser_1.newPage();
    await page.setViewport({ width: 1024, height: 1024 });
    await page.setRequestInterception(true);
    page.on('request', interceptedRequest => {
        if (interceptedRequest.url().match(/adv/i) || interceptedRequest.url().match(/css/i))
            interceptedRequest.abort();
        else
            interceptedRequest.continue();
    });
    await page.goto(`http://1337x.to/category-search/${q}/Movies/${p || 1}/`);
    let movies = await page
        .evaluate(() => {
        return $('tr')
            .map(function () {
            return {
                name: $(this).find('td.name a').last().text(),
                path: 'http://1337x.to/' + $(this).find('td.name a').last().attr('href'),
                size: $(this).find('td.size').html(),
                seeds: $(this).find('td.seeds').text(),
                leeches: $(this).find('td.leeches').text(),
                uploader: $(this).find('td.coll-5 a').text(),
                source: '1337x'
            };
        })
            .toArray();
    });
    page.close();
    movies = movies.filter((m) => !!m.name);
    movies.forEach((movie) => movie.size = bytes_1.parse(movie.size));
    return movies;
}
exports.search = search;
//# sourceMappingURL=1337x.js.map