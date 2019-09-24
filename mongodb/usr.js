const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

// 连接mongodb
mongoose.connect('mongodb://47.102.218.8/user', {
  useNewUrlParser: true,
  socketTimeoutMS: 10000
});

let UserSchema = new mongoose.Schema({
  name: String, 
  emil: String,
  sex: String,
  label: String,
  tips: String,
  like: {
    type: Number,
    default: 0
  },
  avatar: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    set(val) {
      return bcrypt.hashSync(val,12);
    }
  }
});
let ArticalSchema = new mongoose.Schema({
  title: String, 
  content: String,
  author: Object,
  id: String,
  likes: Array,
  collect: Number,
  answer: Array,
  create_time: String
});


const userModel = mongoose.model('user', UserSchema);
const articalModel = mongoose.model('artical', ArticalSchema);

const db = mongoose.connection;

db.on('error', function callback() { //监听是否有异常
    console.log("Connection error");
});
db.once('open', function callback() { //监听一次打开
    //在这里创建你的模式和模型
    console.log('数据库连接成功');
});
 
module.exports = {
  userModel,
  articalModel
};