const { avatars, chatMsg } = require("../controllers/c_upload")
const { create, modify } = require("../controllers/c_group")
//图片路由
module.exports = {

    // 用户头像
    "POST /upload/user": async ctx => {
        let token = ctx.req.body.token
        let url = "http://localhost:3000/userImg/" + ctx.req.file.filename
        let res = await avatars(token, url)
        ctx.body = res
    },

    // 发送图片信息
    "POST /upload/chat": async ctx => {
        let data = ctx.req.body
        let url = "http://localhost:3000/chatImg/" + ctx.req.file.filename
        data.message = url
        data.type = "image"
        let res = await chatMsg(data)
        ctx.body = res
    },

    // 创建群组上传群组头像
    "POST /upload/group": async ctx => {
        let data = ctx.req.body
        data.imgUrl = "http://localhost:3000/groupImg/" + ctx.req.file.filename
        let res = await create(data)
        ctx.body = res
    },

    //修改群组头像
    "POST /upload/group/modify": async ctx => {
        let data = ctx.req.body
        data.imgUrl = "http://localhost:3000/groupImg/" + ctx.req.file.filename
        let res = await modify(data)
        ctx.body = res
    },
}