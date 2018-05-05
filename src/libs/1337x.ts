import {parse} from 'bytes'
import {newPage} from './browser'
// import {respected} from './respected'

declare const $: any

async function details(path) {
    let page = await newPage()
    await page.setViewport({width: 1024, height: 1024})
    await page.setRequestInterception(true);

    page.on('request', interceptedRequest => {
        if (interceptedRequest.url().match(/adv/i) || interceptedRequest.url().match(/css/i))
            interceptedRequest.abort();
        else
            interceptedRequest.continue();
    });

    await page.goto(path)

    let details = await page
        .evaluate(() => {
            let magnet = $('a').filter(function () {
                return $(this).html().match(/magnet download/i)
            }).attr('href')

            return {
                name: $('h1').html().trim(),
                magnet: magnet,
                source: '1337x'
            }
        })

    page.close()

    return details
}

async function search(q, p) {
    let page = await newPage()
    await page.setViewport({width: 1024, height: 1024})
    await page.setRequestInterception(true);

    page.on('request', interceptedRequest => {
        if (interceptedRequest.url().match(/adv/i) || interceptedRequest.url().match(/css/i))
            interceptedRequest.abort();
        else
            interceptedRequest.continue();
    });

    await page.goto(`http://1337x.to/category-search/${q}/Movies/${p || 1}/`)

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
                    }
                })
                .toArray()
        })

    page.close()

    movies = movies.filter((m: any) => !!m.name)
    movies.forEach((movie: any) => movie.size = parse(movie.size))

    return movies
}

export {search, details}
