const { published, giveALike, comment } = require("../controllers/c_dynamic")

module.exports = {
    // 发布动态
    "POST /dynamic/published": async ctx => {
        let res = await published(ctx.request.body)
        ctx.body = res
    },

    // 点赞
    "POST /dynamic/like": async ctx => {
        let res = await giveALike(ctx.request.body)
        ctx.body = res
    },

    // 评论
    "POST /dynamic/comment": async ctx => {
        let res = await comment(ctx.request.body)
        ctx.body = res
    }
}