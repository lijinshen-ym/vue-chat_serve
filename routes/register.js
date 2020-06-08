module.exports = {
    //POST 和 /category/list 中间是带空格的，方便进行字符串的截取
    'POST /register': async ctx => {
        console.log('我是注册路由')
        ctx.body = {
            msg: "我接收到了",
            status: 200
        }
    }
}