import {parse} from 'bytes'
import {newPage} from './browser'

declare const $: any

async function details(url: string) {
    let page = await newPage()
    await page.setViewport({width: 1024, height: 1024})
    await page.setRequestInterception(true);
    page.on('request', interceptedRequest => {
        if (interceptedRequest.url().match(/adv/i) || interceptedRequest.url().match(/css/i))
            interceptedRequest.abort();
        else
            interceptedRequest.continue();
    });

    await page.goto(url)

    let details = await page
        .evaluate(() => {
            let name = $('h1').html().trim()
            let magnet = $('a.button--big')
                .map(function () {
                    return $(this).attr('href')
                })
                .toArray()
                .filter((m: string) => m.match(/magnet/))
                .pop()

            return {
                name: name,
                magnet: magnet || null,
                source: 'kat'
            }
        })

    page.close()

    return details
}

async function search(q: string, p: number) {
    let page = await newPage()
    await page.setViewport({width: 1024, height: 1024})
    await page.setRequestInterception(true);

    page.on('request', interceptedRequest => {
        if (interceptedRequest.url().match(/adv/i) || interceptedRequest.url().match(/css/i))
            interceptedRequest.abort();
        else
            interceptedRequest.continue();
    });

    await page.goto(`http://katcr.co/katsearch/page/${p || 0}/${q}`)

    let movies = await page
        .evaluate(() => {
            return $('table.table tr')
                .map(function () {
                    return {
                        path: $(this).find('td > div > .text--left > a').attr('href'),
                        name: $(this).find('td > div > .text--left > a').text(),
                        size: $(this).find('td[data-title="Size"]').text(),
                        seeds: $(this).find('td[data-title="Seed"]').text(),
                        leeches: $(this).find('td[data-title="Leech"]').text(),
                        uploader: $(this).find('td > div > .text--left > span > span > a').text(),
                        source: 'kat'
                    }
                })
                .toArray()
        })

    await page.close()

    movies = movies.filter((m: any) => !!m.name)
    movies.forEach((movie: any) => movie.size = parse(movie.size))

    return movies
}

export {search, details}
