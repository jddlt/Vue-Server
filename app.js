const express = require('express');
const app = express()
const postParams = require('./util/postParams')
const userModel = require('./mongodb/usr')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")

// app.static(path.resolve(__dirname, './dist'))
app.set('secret','jddlt') 

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
  // const params = await postParams(req);
  // const { id } = jwt.verify(params.token, app.get("secret"))
  next();
});

app.post('/login', async (req, res) => {
  const params = await postParams(req);
  userModel.find({
    emil: params.emil
  }, (err, msg) => {
    if (err) {
      res.status(500).send({ error: '服务器错误' }) 
    } else {
      if(msg.length) {
        // 验证密码是否正确
        const isTrue = bcrypt.compareSync(params.password, msg[0].password)
        if(isTrue) {
          const token = jwt.sign({ id: msg[0]._id }, app.get("secret"));
          res.status(200).send({ data: '登陆成功', token }) 
        }else{
          res.status(400).send({ error: '密码错误' })
        }
      } else {
        res.status(400).send({ error: '该邮箱暂未注册' }) 
      }
    }
  })
})

app.post('/addUser', async (req, res) => {
  const params = await postParams(req);

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
        res.status(500).send({ error: '未知错误' }) 
        return
      }
      res.status(200).send({ data: '创建成功' }) 
    })
  }).catch(err => {
    res.status(400).send({ error: err }) 
  })
})