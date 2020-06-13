const { getinfo, modify, findUser, addition } = require("../controllers/c_user")

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


    },

    "GET /user/find": async ctx => {
        let res = await findUser(ctx.request.query)
        ctx.body = res
    },

    "POST /user/addition": async ctx => {
        let res = await addition(ctx.request.body)
        if (res.nModified) {
            ctx.body = {
                status: 1,
                msg: "请求发送成功"
            }
        } else {
            ctx.body = {
                status: 0,
                msg: "请求发送失败，请稍后再试"
            }
        }
    }
}