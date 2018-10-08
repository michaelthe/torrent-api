import {loadTorrents, addTorrent} from './client'

describe('torrent client', () => {

    beforeAll(async () => {
        await loadTorrents()
    })

    it('add torrent', async () => {
        let hash = await addTorrent('magnet:?xt=urn:btih:f7d7e4cfdfab352fe99325a3d0dca394d8c743cf&dn=Mom S05E20 Ocular Fluid and Fighting Robots 720p AMZN WEBRip DDP5 1 x264 NTb [eztv]&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.opentrackr.org:1337&tr=udp://tracker.pirateparty.gr:6969&tr=udp://eddie4.nl:6969')
        expect(hash).toBeTruthy()
    })
})
