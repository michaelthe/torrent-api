import {close} from './browser'
import {search, details} from './kat'

describe('kat torrents', () => {
    afterAll(async () => {
        return await close()
    })

    test('search', async () => {
        const results = await search('robot', 1)

        expect(results.length).toBeTruthy()

        const result = results[0]

        console.log('kat search result', result)
        expect(result.path).toBeTruthy()
        expect(result.name).toBeTruthy()
        expect(result.size).toBeTruthy()
        expect(result.seeds).toBeTruthy()
        expect(result.leeches).toBeTruthy()
        expect(result.uploader).toBeTruthy()
        expect(result.source).toBeTruthy()

        return true
    }, 10 * 1000)

    test('details', async () => {
        let result = await details('https://katcr.co/torrent/294266/mr-robot-s02e10-proper-720p-hdtv-x264-killers-eztv.html#main')

        console.log('kat details result', result)
        expect(result.name).toBeTruthy()
        expect(result.magnet).toBeTruthy()
        expect(result.source).toBeTruthy()

        return true
    }, 10 * 1000)
})
