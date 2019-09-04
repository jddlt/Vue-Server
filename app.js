const express = require('express');
const app = express()
const postParams = require('./util/postParams')
const { userModel, articalModel } = require('./mongodb/usr')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
const { mySend, myError } = require('./util/send')

// app.static(path.resolve(__dirname, './dist'))
app.set('secret','jddlt')
const notNeedLoginPath = ['/login', '/addUser', '/userInfo']
app.set('_id', '')
app.set('params', '')
function isUserInfo(url) {
  return url == '/userInfo'
}

app.listen(3000, () => {
  console.log('服务器启动成功');
})

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
  if(req.method == 'GET') {
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
          if(decode.id) {
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


app.get('/sendArtical', async (req, res) => {
  const { title, content } = req.query;
  articalModel.create({
    title,
    content,
    _id: app.get('_id')
  }, err => {
    if (err) {
      myError(res) 
      return
    }
    mySend(res, { msg: '发贴成功' }) 
  })
})







































































app.get('/userInfo', async (req, res) => {
  const params = req.query;
  if (params.token) {
    jwt.verify(params.token, app.get('secret'), (err, decode) => {
      if (err) {
        mySend(res, { msg: '登录信息已失效' })
      } else {
        if(decode.id) {
          userModel.find({
            _id: decode.id
          }, (err, msg) => {
            if (err) {
              myError(res)
            } else {
              if(msg.length) {
                mySend(res, { data: { name: msg[0].name, emil: msg[0].emil } })
              } else {
                mySend(res, { msg: '该用户不存在', code: 200 })
              }
            }
          })
        } else {
          mySend(res, { msg: '登录信息已失效' })
          return
        }
      }
    })
  } else {
    mySend(res, { msg: '未登录' })
  }
})

app.post('/login', async (req, res) => {
  const params = app.get('params')
  userModel.find({
    emil: params.emil
  }, (err, msg) => {
    if (err) {
      myError(res)
    } else {
      if(msg.length) {
        // 验证密码是否正确
        const isTrue = bcrypt.compareSync(params.password, msg[0].password)
        if(isTrue) {
          const token = jwt.sign({ id: msg[0]._id }, app.get("secret"));
          mySend(res, { msg: '登陆成功', data: { token }})
        }else{
          mySend(res, { msg: '密码错误', code: 400 })
        }
      } else {
        mySend(res, { msg: '该邮箱暂未注册', code: 400 })
      }
    }
  })
})

app.post('/addUser', async (req, res) => {
  const params = app.get('params')
  const findName = new Promise((resolve, reject) => {
    userModel.find({
      name: params.name
    }, (err, msg) => {
      if (err) {
        reject('未知错误')
      } else {
        if(msg.length) {
          reject('昵称已重复')
        } else {
          resolve()
        }
      }
    })
  })
  const findEmil = new Promise((resolve, reject) => {
    userModel.find({
      emil: params.emil
    }, (err, msg) => {
      if (err) {
        reject('未知错误')
      } else {
        if(msg.length) {
          reject('邮箱已被注册')
        } else {
          resolve()
        }
      }
    })
  })
  Promise.all([findName, findEmil]).then(() => {
    userModel.create({
      name: params.name,
      emil: params.emil,
      password: params.password
    }, err => {
      if (err) {
        myError(res) 
        return
      }
      mySend(res, { msg: '创建成功' }) 
    })
  }).catch(err => {
    mySend(res, { msg: err, code: 400 })
  })
})