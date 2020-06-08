const { login } = require("../controllers/c_login")
module.exports = {
    "POST /login": async ctx => {
        console.log(ctx.request.body)
        login(ctx.request.body)
        ctx.body = {
            msg: "我接受到了"
        }
    }
}