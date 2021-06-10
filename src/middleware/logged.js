const jwt   = require("jsonwebtoken")
const chalk = require("chalk")

const logged = async (req, res, next) => {
 
    try{   
        //Valid Token?
        const token = req.user.token
        
        //JWT valid?
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

    }catch(e){ 
        console.log(chalk.red("Could not verify login for token!"))
        return res.redirect("/login")}

    next()

    
}

module.exports = logged