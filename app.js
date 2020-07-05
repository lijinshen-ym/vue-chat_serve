const Koa = require("koa")
const app = new Koa();
const static = require("koa-static")
const cors = require("koa2-cors")
const router = require("koa-router")()
const bodyParser = require("koa-bodyparser")
const mongoose = require("mongoose")
const fs = require("fs")
const path = require("path")

// 处理文件上传
const { upload } = require("./tool/multer")


// socket.io
const server = require('http').Server(app.callback());  //koa正确姿势
const io = require('socket.io')(server); //核心，实现客户端之间交互通信

// socket处理逻辑
const { detail } = require("./controllers/socket")


const routesData = {}

app.use(bodyParser());
app.use(static("./public")) //指定静态目录
app.use(cors({}))
app.use(router.routes())


// 自动化注册后端路由
const routesPath = path.join(__dirname, "routes")
const files = fs.readdirSync(routesPath)
files.forEach(item => {
    Object.assign(routesData, require(path.join(routesPath, item)))
})
for (let key in routesData) {
    let [method, url] = key.split(' ')
    method = method.toLowerCase()
    if (url.includes("/upload")) {  //处理上传文件的路由
        router[method](url, upload.single('file'), routesData[key])
    } else { //处理普通路由
        router[method](url, routesData[key])
    }
}

// socket.io

io.on("connection", socket => {
    detail(io, socket)
})

mongoose.connect("mongodb://localhost:27017/chat", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("chat数据库已经连接")
    server.listen(3000, () => {
        console.log(`监听地址: http://localhost:3000`);
    })
    // app.listen("3000", function () {
    //     console.log("3000端口已经启动")
    // })
}).catch(() => {
    console.log("数据库连接失败")
})