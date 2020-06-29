let { create, getList, groupInfo } = require("../controllers/c_group")
module.exports = {
    //创建群列表
    "POST /group/creat": async ctx => {
        let res = await create(ctx.request.boyd)
        ctx.body = res
    },

    // 获取群详情
    "GET /group/info": async ctx => {
        let res = await groupInfo(ctx.request.query)
        ctx.body = res
    },

    //获取群列表
    "GET /group/list": async ctx => {
        let res = await getList(ctx.request.query)
        ctx.body = res
    }

}