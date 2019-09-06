const postParams = require('./../../util/postParams')
// const { userModel, articalModel } = require('../../mongodb/usr')
// const { mySend, myError } = require('../../util/send')

module.exports = function (app) {
  // 上传文件
  app.post('/upload', async (req, res) => {
      let params = {}
      // console.log(req)
      console.log(params, 11)
      postParams(req).then(res => {
        console.log(res, 33333)
      }).catch(e => {
        console.log(e)
      })
      // console.log(params, 22)
    })

}
