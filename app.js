const Koa = require("koa")
const app = new Koa();
const static = require("koa-static")
const cors = require("koa2-cors")
const router = require("koa-router")()
const bodyParser = require("koa-bodyparser")
const mongoose = require("mongoose")


app.use(bodyParser());
app.use(static("./public")) //指定静态目录
app.use(cors())
app.use(router.routes())






mongoose.connect("mongodb://localhost:27017/chat", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("chat数据库已经连接")
    app.listen("3000", function () {
        console.log("3000端口已经启动")
    })
}).catch(() => {
    console.log("数据库连接失败")
})