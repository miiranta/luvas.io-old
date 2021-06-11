//Requires
const chalk = require("chalk")

//not logged?
const notLogged = async (req, res, next) => {
 
    //If req.user do exist > redirect to home
    if(req.user){
        req.user = {}
        return res.redirect("/home")
    }

    next()

}

module.exports = notLogged