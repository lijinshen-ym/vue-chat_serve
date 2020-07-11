let { getDyNotify, remove } = require("../controllers/c_dyNotify")

module.exports = {
    "GET /dynamic/notify/get": async ctx => {
        let res = await getDyNotify(ctx.request.query)
        ctx.body = res
    },

    "POST /dynamic/notify/remove": async ctx => {
        let res = await remove(ctx.request.body)
        ctx.body = res
    }
}