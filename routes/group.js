let { create } = require("../controllers/c_group")
module.exports = {
    "POST /group/creat": async ctx => {
        let res = await create(ctx.request.boyd)
        ctx.body = res
    }
}