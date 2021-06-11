//Requires
const chalk = require("chalk")

//logged?
const logged = async (req, res, next) => {
 
    //If req.user does not exist > redirect to login
    if(!req.user){
        console.log(chalk.red("Redirecting non-auth user!"))
        req.user = {}
        return res.redirect("/login")
    }

    next()

}

module.exports = logged