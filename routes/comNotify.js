let { obtain } = require("../controllers/c_comNotify")
module.exports = {
    "GET /comment/notify": async ctx => {
        let res = await obtain(ctx.request.query)
        ctx.body = res
    }
}