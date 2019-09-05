const postParams = require('../../util/postParams')
const { userModel, articalModel } = require('../../mongodb/usr')
const { mySend, myError } = require('../../util/send')


module.exports = function (app) {

    // 发帖子接口
    app.get('/artical/sendArtical', async (req, res) => {
        const { title, content, author } = req.query;
        articalModel.create({
            title,
            content,
            likes: 0,
            answer: [],
            collect: 0,
            answer_num: 0,
            id: app.get('_id'),
            author: JSON.parse(author)
        }, err => {
            if (err) {
                myError(res, err)
                return
            }
            mySend(res, { msg: '发贴成功' })
        })
    })

    // 获取帖子
    app.get('/artical', async (req, res) => {
        // const { title, content, author } = req.query;
        articalModel.find({}, (err, msg) => {
            if (err) {
                myError(res, err)
                return
            }
            mySend(res, { msg: '获取成功', data: msg })
        })
    })

}
