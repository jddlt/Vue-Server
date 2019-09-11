const fs = require('fs');
const path = require('path');
const qiniu = require('qiniu')
// const { ak, sk, host, bucket } = require('./upload.config')
const { mySend, myError } = require('./../../util/send')
const { userModel, articalModel } = require('../../mongodb/usr')
 
const host = 'http://pxo628kfn.bkt.clouddn.com/'

// 七牛云配置

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


module.exports = function (app) {
  app.post('/upload',  async function ( req, res, next ) {
    const params = app.get('params')
    const _id = app.get('_id')
    console.log(_id);
    
    userModel.updateOne({_id}, {avatar: host + params.hash}, {upsert: true, new: true, setDefaultsOnInsert: true}, (err, msg) => {
        if (err) {
            myError(res, err)
            return
        }
        mySend(res,{ msg: '修改成功' })
    });
  });
}

 