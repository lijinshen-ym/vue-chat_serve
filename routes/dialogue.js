const { dialogueList } = require("../controllers/c_dialogue")
module.exports = {
    "GET /dialogue/list": async ctx => {
        let res = await dialogueList(ctx.request.query)
        ctx.body = res
    }
}