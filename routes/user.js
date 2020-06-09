const { getinfo, modify } = require("../controllers/c_user")

module.exports = {
    "GET /user/info": async ctx => {
        let user = await getinfo(ctx.request.query)
        ctx.body = {
            msg: "获取成功",
            status: 200,
            user
        }
    },
    "POST /user/modify": async ctx => {
        let res = await modify(ctx.request.body)
        ctx.body = res


    }
}