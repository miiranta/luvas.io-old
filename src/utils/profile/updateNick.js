const User              = require("../../db/models/users")
const verifyNick        = require("../../utils/profile/verifyNick")
const printToConsole    = require("../other/printToConsole")

async function updateNick(req){
    const nick = req.body.nick
    var verify
    
    await verifyNick(nick).then((data)=>{verify = data})
        
    if(verify){
        return {status: 400}
    }
    
    await User.updateOne({_id: req.user._id}, {nick})

    printToConsole('profile', 'Nick update: ', req.user.email + ' is now ', nick)
    return {status: 200}
}

module.exports = updateNick