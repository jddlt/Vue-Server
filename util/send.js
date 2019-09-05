exports.mySend = function (res, option) {
    if (Object.prototype.toString.call(option) === '[object Object]') {
        let {status, code, data, msg} = option
        if(res) {
            status = status ? status : 200;
            code = code ? code : 200;
            data = data ? data : {};
            msg = msg ? msg : ''
            res.status(status).send({code, msg, data})
        } else {
            throw new Error('send函数传参必须传response对象')
        }
    } else {
        throw new Error('sen函数传参需要是对象')
    }
}
exports.myError = function(res, err){
    res.status(500).send({code: 500, msg: `服务器错误`, data: {}, errMsg: err})
}