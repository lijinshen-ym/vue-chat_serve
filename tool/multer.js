// 处理文件上传
const multer = require('koa-multer')

//关于上传文件的配置 需要安装koa-multer
var storage = multer.diskStorage({
    //文件保存路径由前端传递过来 savePath
    destination: function (req, file, cb) {
        let { savePath } = req.body
        cb(null, savePath)
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
