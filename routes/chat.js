let { history } = require("../controllers/c_chat")
module.exports = {
    "GET /chat/history": async ctx => {
        let res = await history(ctx.request.query)
        ctx.body = res
    }
}