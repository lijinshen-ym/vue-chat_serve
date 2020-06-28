const { dialogueList, updateUnRead } = require("../controllers/c_dialogue")
module.exports = {
    "GET /dialogue/list": async ctx => {
        let res = await dialogueList(ctx.request.query)
        ctx.body = res
    },
    "POST /dialogue/updateUnRead": async ctx => {
        let res = await updateUnRead(ctx.request.body)
        ctx.body = res
    }
}