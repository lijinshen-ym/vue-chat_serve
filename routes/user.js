const {
    getInfo,
    modify,
    findUser,
} = require("../controllers/c_user")

module.exports = {

    // 获取用户信息
    "GET /user/info": async ctx => {
        let user = await getInfo(ctx.request.query)
        ctx.body = {
            msg: "获取成功",
            status: 200,
            user
        }
    },
    // 修改用户信息
    "POST /user/modify": async ctx => {
        let res = await modify(ctx.request.body)
        ctx.body = res


    },
    // 查找用户
    "GET /user/find": async ctx => {
        let res = await findUser(ctx.request.query)
        ctx.body = res
    },

}