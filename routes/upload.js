const { upload } = require("../controllers/c_upload")
//图片路由
module.exports = {
    "POST /upload/userimg": async  ctx => {
        let token = ctx.req.body.token
        let url = "http://localhost:3000/userImg/" + ctx.req.file.filename
        let res = await upload(token, url)
        ctx.body = res
    }
}