// 处理文件上传
const multer = require('koa-multer')

const fs = require("fs")
const path = require("path")
const { verifyToken } = require("../tool/token")

//关于上传文件的配置 需要安装koa-multer
var storage = multer.diskStorage({
    //文件保存路径由前端传递过来 savePath
    destination: function (req, file, cb) {
        let { savePath, token, id } = req.body
        let tokenRes = verifyToken(token)
        let date = new Date()
        let time = date.getFullYear() + "" + (date.getMonth() + 1) + "" + date.getDate()
        let path = ""
        if (savePath == "userImg") { //上传头像
            path = "public/" + tokenRes.id + "/" + savePath
            req.body.savePath = tokenRes.id + "/" + savePath
        } else if (savePath == "chatImg") { //私聊
            path = "public/" + tokenRes.id + "/" + savePath + "/" + id + "/" + time
            req.body.savePath = tokenRes.id + "/" + savePath + "/" + id + "/" + time
        } else if (savePath == "groupImg/chat") { //群聊
            path = "public/" + savePath + "/" + id + "/" + time
            req.body.savePath = savePath + "/" + id + "/" + time
        } else if (savePath == "groupImg/avatars") { //群头像
            path = "public/" + savePath + "/" + id
            req.body.savePath = savePath + "/" + id
        } else if (savePath == "dynamicImg") { //动态
            path = "public/" + tokenRes.id + "/" + savePath + "/" + time
            req.body.savePath = tokenRes.id + "/" + savePath + "/" + time
        }
        mkDirsSync(path)
        cb(null, path)
    },
    //修改文件名称
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");  //以点分割成数组，数组的最后一项就是后缀名
        cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
})
//加载配置
var upload = multer({ storage: storage });

exports.upload = upload

// 递归创建目录 同步方法
function mkDirsSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkDirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
}