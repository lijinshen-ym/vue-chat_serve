const { getNotice } = require("../controllers/c_notify")

module.exports = {
    "GET /notify/notice": async ctx => {
        let res = await getNotice(ctx.request.query)
        ctx.body = res
    }
}