const fs = require('fs');
const path = require('path');
const postParams = require('./../../util/postParams')
const { mySend, myError } = require('./../../util/send')
const { userModel, articalModel } = require('../../mongodb/usr')
 



module.exports = function (app) {
  const host = app.get('host')
  app.post('/upload',  async function ( req, res, next ) {
    const _id = app.get('_id')
    const params = app.get('params')
    userModel.updateOne({_id}, {'$set': { 'avatar': (host + params.key) }},  (err, msg) => {
        if (err) {
            myError(res, err)
            return
        }
        mySend(res,{ msg: '修改成功' })
    });
  });
}

 






// 七牛云配置 (以后可能会有用)

// const qiniu = require('qiniu')
// const { ak, sk, host, bucket } = require('./upload.config')

// const mac = new qiniu.auth.digest.Mac(ak, sk);
// const options = {
//   scope: bucket,
// };
// const putPolicy = new qiniu.rs.PutPolicy(options);
// const uploadToken = putPolicy.uploadToken(mac);
// const config = new qiniu.conf.Config();
// config.zone = qiniu.zone.Zone_z0;
// config.useHttpsDomain = true;
// config.useCdnDomain = true;