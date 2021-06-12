//Requires
const chalk     = require("chalk")
const User      = require("../db/models/users")

//logged?
const logged = async (req, res, next) => {

    //If req.user does not exist > redirect to login
    if(!req.user){
        console.log(chalk.red("Redirecting non-auth user!"))
        req.user = {}
        return res.redirect("/login")
    }

//Add IP to session ---------------------------------------------

    //Get IP
    var ip = req.socket.remoteAddress || null;

    //Every session except the one you are using
    var token = req.user.token
    const openSessions = req.user.tokens.filter((tokenFound)=> {return token !== tokenFound.token})

    //The session you are using
    const yourSession = req.user.tokens.filter((tokenFound)=> {return token == tokenFound.token})

    //Add IP to session
    yourSession[0].ip = ""
    const newReqTokens = [{...yourSession[0], ip}]
    req.user.tokens = openSessions.concat(newReqTokens)

    //Save to db
    await User.updateOne({_id: req.user._id},{tokens: req.user.tokens})
    
//-----------------------------------------------------------------    

    next()

}

module.exports = logged