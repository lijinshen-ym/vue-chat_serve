const { published, giveALike } = require("../controllers/c_dynamic")

module.exports = {
    "POST /dynamic/published": async ctx => {
        let res = await published(ctx.request.body)
        ctx.body = res
    },

    "POST /dynamic/like": async ctx => {
        let res = await giveALike(ctx.request.body)
        ctx.body = res
    }
}