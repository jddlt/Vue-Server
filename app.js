const express = require('express');
const app = express()
const postParams = require('./util/postParams')
const jwt = require("jsonwebtoken");
const { mySend, myError } = require('./util/send')
const routs = require('./routes')

// app.static(path.resolve(__dirname, './dist'))
const notNeedLoginPath = ['/login', '/addUser', '/userInfo', '/artical']

app.listen(3000, () => {
  console.log('服务器启动成功');
})

app.set('secret', 'jddlt')
app.set('_id', '')
app.set('params', '')


//设置允许跨域访问该服务.  //wocao 放前面 md
app.all('*', async function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});


// 请求拦截
app.use(async function (req, res, next) {
  let params = {}
  if (req.method == 'GET') {
    params = req.query || {}
  } else if (req.method == 'POST') {
    params = await postParams(req) || {};
  }
  if (notNeedLoginPath.includes(req.url.split('?')[0])) {
    if (req.method == 'POST') { app.set('params', params) }
    next();
  } else {
    if (params.token) {
      jwt.verify(params.token, app.get('secret'), (err, decode) => {
        if (err) {
          mySend(res, { msg: '登录信息已失效', code: 401 })
        } else {
          if (decode.id) {
            app.set('_id', decode.id)
            next();
          } else {
            mySend(res, { msg: '登录信息已失效', code: 401 })
          }
        }
      })
    } else {
      mySend(res, { msg: '未登录', code: 401 })
    }
  }
})


// 路由
routs(app)
