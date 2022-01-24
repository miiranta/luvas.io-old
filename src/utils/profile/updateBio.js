const User              = require("../../db/models/users")
const printToConsole    = require("../other/printToConsole")
const { verifyBio }     = require("./verifyBio")

async function updateBio(req){
    const bio = req.body
    const verify = await verifyBio(bio)
        
    if(verify){
        return {status: 400}
    }

    printToConsole('profile', 'Bio update: ', req.user.nick, '')
    await User.updateOne({_id: req.user._id}, {bio: JSON.stringify(bio)})
    return {status: 200}
}

module.exports = updateBio