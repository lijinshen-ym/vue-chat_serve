const { avatars, chatMsg, groupMsg, publish } = require("../controllers/c_upload")
const { create, modify } = require("../controllers/c_group")
//图片路由
module.exports = {

    // 用户头像
    "POST /upload/user": async ctx => {
        let token = ctx.req.body.token
        let url = "http://localhost:3000/" + ctx.req.body.savePath + "/" + ctx.req.file.filename
        console.log(url)
        let res = await avatars(token, url)
        ctx.body = res
    },

    // 发送图片信息 （私聊）
    "POST /upload/chat/private": async ctx => {
        let data = ctx.req.body
        let url = "http://localhost:3000/" + ctx.req.body.savePath + "/" + ctx.req.file.filename
        console.log(url)
        data.message = url
        data.type = "image"
        let res = await chatMsg(data)
        ctx.body = res
    },

    // 发送图片信息（群聊）
    "POST /upload/chat/group": async ctx => {
        let data = ctx.req.body
        let url = "http://localhost:3000/" + ctx.req.body.savePath + "/" + ctx.req.file.filename
        console.log(url)
        data.message = url
        data.type = "image"
        let res = await groupMsg(data)
        ctx.body = res
    },

    // 创建群组上传群组头像
    "POST /upload/group": async ctx => {
        let data = ctx.req.body
        data.imgUrl = "http://localhost:3000/" + ctx.req.body.savePath + "/" + ctx.req.file.filename
        let res = await create(data)
        ctx.body = res
    },

    //修改群组头像
    "POST /upload/group/modify": async ctx => {
        let data = ctx.req.body
        data.imgUrl = "http://localhost:3000/" + ctx.req.body.savePath + "/" + ctx.req.file.filename
        let res = await modify(data)
        ctx.body = res
    },

    // 上传朋友圈图片
    "POST /upload/dynamic": async ctx => {
        // let data = ctx.req.body 
        let imgUrl = "http://localhost:3000/dynamicImg/" + ctx.req.file.filename
        ctx.body = imgUrl
    },
}