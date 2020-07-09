const { published } = require("../controllers/c_dynamic")

module.exports = {
    "POST /dynamic/published": async ctx => {
        let res = await published(ctx.request.body)
        ctx.body = res
    }
}