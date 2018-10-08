import {Router} from 'express'
import * as kat from './libs/kat'
import * as thirteen from './libs/1337x'

const router = Router()


router.get('/search', async (req, res) => {
    let q = req.query.q
    let page = req.query.page

    let results = await Promise
        .all([
            kat.search(q, page),
            thirteen.search(q, page)
        ])

    let max = results.reduce((max, a) => max < a.length ? a.length : max, 0)
    let result = []
    for (let i = 0; i < max; i++) {
        for (let a = 0; a < results.length; a++) {
            if (results[a][i]) {
                result.push(results[a][i])
            }
        }
    }

    res.json({torrents: result})
})


export {router}

