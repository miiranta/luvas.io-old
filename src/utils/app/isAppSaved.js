const { sanitizeInput }     = require("../other/sanitizeInput");
const jwt                   = require("jsonwebtoken");
const Like                  = require("../../db/models/likes");
const App                   = require("../../db/models/apps");

async function isAppSaved(appName, socket){
    var user = null;

    try{
        var userJWT = await sanitizeInput(socket.handshake.session.passport.user)
        var user = await jwt.verify(userJWT, process.env.JWT_SECRET)
        if(!user){throw new Error()}
    }catch(e){
        user = null;
    }

    if(!user){
        return {showButton: false};
    }
    
    
    const appData = await App.findOne({name: appName.appName, owner: user._id})

    if(!appData){
        return {showButton: false};
    }
    
    const isSaved = await Like.findOne({postId: appData._id, likeOwner: user._id})

    if(isSaved){
        return {showButton: true, saved: true}
    }

    return {showButton: true, saved: false}
}


module.exports = isAppSaved