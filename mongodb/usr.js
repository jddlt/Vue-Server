const mongoose = require('mongoose')

// 连接mongodb
mongoose.connect('mongodb://47.102.218.8/user', {
  useNewUrlParser: true,
  socketTimeoutMS: 10000
});

var UserSchema = new mongoose.Schema({
  name: String, 
  emil: String,
  password: String
});
const userModel = mongoose.model('user', UserSchema);

const db = mongoose.connection;

db.on('error', function callback() { //监听是否有异常
    console.log("Connection error");
});
db.once('open', function callback() { //监听一次打开
    //在这里创建你的模式和模型
    console.log('数据库连接成功');
});
 
module.exports = userModel;