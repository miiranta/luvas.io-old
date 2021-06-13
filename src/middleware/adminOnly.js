//Requires
const chalk     = require("chalk")
const User      = require("../db/models/users")


//logged?
const adminOnly = async (req, res, next) => {

    //If req.user does not exist > redirect to login
    if(!req.user){
        console.log(chalk.red("Redirecting non-auth user!"))
        req.user = {}
        return res.redirect("/login")
    }

    //Admin level is enough?
    if(req.user.admin == 0){
        console.log(chalk.red("Redirecting non-admin user!"))
        req.user = {}
        return res.redirect("/home")
    }
  

    next()

}

module.exports = adminOnly