const App       = require("../../db/models/apps");
const Comment   = require("../../db/models/comments");
const User      = require("../../db/models/users");

var page = 0;
var pagesize = 10

async function fetchComments(data){
    data = JSON.parse(data)

    const postName = data.post
    const page = data.page
    const sort = {"createdAt": -1}

    const app = await App.findOne({name: postName})
    if(!app){
        return [];
    }

    var comment = Comment.find({post: app._id})
    .limit(pagesize)
    .skip(page*pagesize)
    .sort(sort)

    try{
        var res = await comment.then((primaryRes) => {
            var secondaryRes = primaryRes.map(changeAppsForm)
            var thirdRes = secondaryRes.map(addNick)
            var res = Promise.all(thirdRes).then((res) => {
                return res;
            })
            return res
        })
        return res;
    }catch(e){
        console.log(e)
        return [];
    }

}

const changeAppsForm = (comment) =>{
    var comment = {
        content: comment.content,
        createdAt: comment.createdAt,
        nick: comment.owner //Later changed to nick!
    }
    return comment;
}

const addNick = async (secondaryRes) => {
    var profile = await User.findOne({_id: secondaryRes.nick})
    if(profile){    
        secondaryRes['nick'] = profile.nick
    }
    return secondaryRes;
}

module.exports = fetchComments

