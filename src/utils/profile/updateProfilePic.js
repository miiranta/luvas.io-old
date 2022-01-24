const sharp = require("sharp")
const User = require("../../db/models/users")
const printToConsole = require("../other/printToConsole")

async function updateProfilePic(req){
    if(req.fileError){
        return {status: 400}
    }

    try{
        const buffer = await sharp(req.file.buffer).resize({width: 150, height: 150}).png().toBuffer()
        req.user.profilePic = "data:image/png;base64," + buffer.toString('base64')
    }catch(error){
        return {status: 500}
    }
    
    await User.updateOne({_id: req.user._id},{profilePic: req.user.profilePic})

    printToConsole('profile', 'Profile picture update: ', req.user.nick, '')
    return {status: 200}
}

module.exports = updateProfilePic