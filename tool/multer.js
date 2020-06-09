// 处理文件上传
const multer = require('koa-multer')

//关于上传文件的配置 需要安装koa-multer
var storage = multer.diskStorage({
    //文件保存路径 public/userImg/
    destination: function (req, file, cb) {
        cb(null, 'public/userImg/')
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
