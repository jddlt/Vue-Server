var fs = require('fs');
var path = require('path');
const { mySend, myError } = require('./../../util/send')
var formidable = require('formidable');
var cacheFolder = path.resolve(__dirname,  './../../public/images');
const postParams = require('./../../util/postParams')
 

module.exports = function (app) {
  app.post('/upload',  async function ( req, res, next ) {
    //   mySend(res, {data: req.body})
    console.log(req);
    res.send(String(req)) 
    // var userDirPath =cacheFolder;
    // if (!fs.existsSync(userDirPath)) {
    //     fs.mkdirSync(userDirPath);
    // }
    // // const params = await postParams(req)
    // // console.log(req.file, params);
    
    // var form = new formidable.IncomingForm(); //创建上传表单
    // form.encoding = 'utf-8'; //设置编辑
    // form.uploadDir = userDirPath; //设置上传目录 
    // form.keepExtensions = true; //保留后缀
    // form.maxFieldsSize = 2 * 1024 * 1024; //文件大小
    // form.type = true; 
    // var displayUrl;
    // form.parse(req, function(err, fields, files) {
    //     if (err) {
    //         console.log(err);
            
    //        return res.json(err); 
    //     }
    //     console.log('files', files);
        
    //     var extName = ''; //后缀名
    //     switch (files.upload.type) {
    //         case 'image/pjpeg':
    //             extName = 'jpg';
    //             break;
    //         case 'image/jpeg':
    //             extName = 'jpg';
    //             break;
    //         case 'image/png':
    //             extName = 'png';
    //             break;
    //         case 'image/x-png':
    //             extName = 'png';
    //             break;
    //     }
    //     if (extName.length === 0) {
    //         return  res.json({
    //             msg: '只支持png和jpg格式图片'
    //         });
    //     } else {
    //         var avatarName = '/' + Date.now() + '.' + extName;
    //         var newPath = form.uploadDir + avatarName;
    //         fs.renameSync(files.upload.path, newPath); //重命名
    //         return res.json(true);
    //     }
    // });
  });
}

 