const App               = require("../../db/models/apps");
const Like              = require("../../db/models/likes");
const { sanitizeInput } = require("../other/sanitizeInput");

async function saveApp(req){
    const appName = sanitizeInput(req.params.id)
    const appDb = await App.findOne({name: appName})

    if(!appDb){
        return {status: 400};
    }

    const likeExists = await Like.findOne({postId: appDb._id, likeOwner: req.user._id})

    if(likeExists){
        return {status: 400};
    }

    await Like.create({postId: appDb._id, likeOwner: req.user._id})
    return {status: 200};
}

async function unsaveApp(req){
    const appName = sanitizeInput(req.params.id)
    const appDb = await App.findOne({name: appName})

    if(!appDb){
        return {status: 400};
    }

    await Like.deleteOne({postId: appDb._id, likeOwner: req.user._id})
    return {status: 200};
}

module.exports = {saveApp, unsaveApp}