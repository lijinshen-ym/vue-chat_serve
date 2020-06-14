const {
    addition,
    acquire,
    deal
} = require("../controllers/c_friend")

module.exports = {
    // 发送好友请求
    "POST /friend/addition": async ctx => {
        let res = await addition(ctx.request.body)
        ctx.body = res
    },
    // 获取好友请求
    "GET /friend/acquire": async ctx => {
        let res = await acquire(ctx.request.query)
        ctx.body = res
    },

    // 处理好友请求
    "POST /friend/deal": async ctx => {
        let res = await deal(ctx.request.body)
        ctx.body = res
    }
}