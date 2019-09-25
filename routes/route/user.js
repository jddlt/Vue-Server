const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const postParams = require('../../util/postParams')
const { userModel, articalModel } = require('../../mongodb/usr')
const { mySend, myError } = require('../../util/send')


module.exports = function (app) {
  const host = app.get('host')

  // 获取用户信息
  app.get('/zx/userInfo', async (req, res) => {
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
                myError(res, err)
              } else {
                if(msg.length) {
                  app.set('userInfo', {...msg[0]._doc})
                  articalModel.countDocuments({id: decode.id}, (err, count) => {
                    if(err) {
                      myError(res, err)
                    }
                    mySend(res, { data: { ...msg[0]._doc, artical_num: count }, msg: '获取成功' })
                  })
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
  
  // 登录
  app.post('/zx/login', async (req, res) => {
    const params = app.get('params')
    userModel.find({
      emil: params.emil
    }, (err, msg) => {
      if (err) {
        myError(res, err)
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

  // 编辑用户信息
  app.post('/zx/editUserInfo', async (req, res) => {
    // const params = app.get('params')
    const { name, emil, sex, label, tips, _id } = app.get('params')
    userModel.updateOne({_id}, {'$set': { 
      'name': name,
      'emil': emil,
      'sex': sex,
      'label': label,
      'tips': tips
    }},  (err, msg) => {
      if (err) {
          myError(res, err)
          return
      }
      mySend(res,{ msg: '修改成功' })
  });
  })
  
  // 注册
  app.post('/zx/addUser', async (req, res) => {
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
        password: params.password,
        avatar: host + 'no-avatar-' + Math.ceil(Math.random() * 2)
      }, err => {
        if (err) {
          myError(res, err) 
          return
        }
        mySend(res, { msg: '创建成功' }) 
      })
    }).catch(err => {
      mySend(res, { msg: err, code: 400 })
    })
  })
}
