"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const kat = __importStar(require("./libs/kat"));
const thirteen = __importStar(require("./libs/1337x"));
const router = express_1.Router();
exports.router = router;
router.get('/search', async (req, res) => {
    let q = req.query.q;
    let page = req.query.page;
    let results = await Promise
        .all([
        kat.search(q, page),
        thirteen.search(q, page)
    ]);
    let max = results.reduce((max, a) => max < a.length ? a.length : max, 0);
    let result = [];
    for (let i = 0; i < max; i++) {
        for (let a = 0; a < results.length; a++) {
            if (results[a][i]) {
                result.push(results[a][i]);
            }
        }
    }
    res.json({ torrents: result });
});
//# sourceMappingURL=api.js.map