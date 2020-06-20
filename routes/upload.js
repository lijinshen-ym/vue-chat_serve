const { avatars, chatMsg } = require("../controllers/c_upload")
//图片路由
module.exports = {
    "POST /upload/user": async ctx => {
        let token = ctx.req.body.token
        let url = "http://localhost:3000/userImg/" + ctx.req.file.filename
        let res = await avatars(token, url)
        ctx.body = res
    },

    "POST /upload/chat": async ctx => {
        let data = ctx.req.body
        let url = "http://localhost:3000/chatImg/" + ctx.req.file.filename
        data.message = url
        data.type = "image"
        console.log(data)
        let res = await chatMsg(data)
        ctx.body = res
    }
}