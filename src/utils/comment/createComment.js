const App               = require("../../db/models/apps")
const Comment           = require("../../db/models/comments")
const { sanitizeInput } = require("../other/sanitizeInput")
const fetchComments     = require("./fetchComments")
const { verifyComment } = require("./verifyComment")

async function createComment(req){
    //Post exists?
    const post = await App.findOne({"name": sanitizeInput(req.params.id)})
    if(!post){
        return {status: 400}
    }
   
    //Comment is okay?
    const comment = req.body
    var verify
    await verifyComment(comment).then((data)=>{verify = data})
    if(verify){
        return {status: 400}
    }

    //Alright
    await Comment.create({owner: req.user._id, post: post._id, content: JSON.stringify(comment)})
    
    //Socket update
    var io = req.app.get('io');

    var commentData = {page: 0, post: post.name}
    var lastComments = await fetchComments(commentData)
    io.emit("comment_" + post.name, lastComments[0])

    return {status: 200}
}

module.exports = createComment