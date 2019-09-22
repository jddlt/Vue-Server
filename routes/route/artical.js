const postParams = require('../../util/postParams')
const { userModel, articalModel } = require('../../mongodb/usr')
const { mySend, myError } = require('../../util/send')

module.exports = function (app) {

    // 发帖子接口
    app.post('/artical/sendArtical', async (req, res) => {
        const { title, content, author } = app.get('params');
        articalModel.create({
            title,
            content,
            likes: 0,
            answer: [],
            collect: 0,
            id: app.get('_id'),
            create_time: new Date().getTime(),
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
        const { pageIndex } = req.query;
        articalModel.countDocuments({}, (err, count) => {
            if (err) {
                myError(res, err)
                return
            }
            articalModel.find({})
                .skip(10 * ((pageIndex ? pageIndex : 1) - 1))
                .limit(10)
                .sort({ '_id': -1 })
                .exec((err, msg) => {
                    if (err) {
                        myError(res, err)
                        return
                    }
                    mySend(res, { msg: '获取成功', data: msg, total: count })
                })
        })
    })

    app.get('/artical/sort', async (req, res) => {
        articalModel.find({}).limit(9).sort({ '_id': -1 }).exec((err, msg) => {
            if (err) {
                myError(res, err)
                return
            }
            mySend(res, { msg: '获取成功', data: msg })
        })
    })

    // 获取帖子详情
    app.get('/artical/detail', async (req, res) => {
        const { _id } = req.query;
        articalModel.findOne({ _id }, (err, msg) => {
            if (err) {
                myError(res, err)
                return
            }
            mySend(res, { msg: '评论成功', data: msg })
        });
    })

    // 回复帖子
    app.get('/artical/reply', async (req, res) => {
        const { _id, content } = req.query;
        articalModel.updateOne({ _id }, {
            '$push': {
                answer: {
                    user_info: app.get('userInfo'),
                    content,
                    time: new Date().getTime()
                }
            }
        }, (err, msg) => {
            if (err) {
                myError(res, err)
                return
            }
            mySend(res, { msg: '评论成功' })
        });
    })

}
