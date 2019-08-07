const Koa = require('koa')
const router = require('koa-router')()
const views = require('koa-views')
const staticPublic = require('koa-static')
const conditional = require('koa-conditional-get')
const etag = require('koa-etag')
const path = require('path')
const bodyParser = require('koa-bodyparser');

const app = new Koa()

// bodyParser
app.use(bodyParser())
// etag
app.use(conditional())
app.use(etag())
// 静态资源
app.use(staticPublic(path.join(path.resolve(__dirname), '../public')))

// ejs
app.use(
  views(path.resolve(__dirname, '../src/pages'), {
    extension: 'ejs'
  })
)

// 全局变量
app.use(async(ctx, next) => {
  ctx.state.commonPath = path.resolve(__dirname, '../src/common')
  await next()
})

app.use(router.routes()) /* 启动路由 */
app.use(router.allowedMethods())
app.listen(9091)
