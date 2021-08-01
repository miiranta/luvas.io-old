const chalk = require("chalk")

const notLogged = async (req, res, next) => {

    if(req.user){
        req.user = {}
        return res.redirect("/home")
    }

    next()

}

module.exports = notLogged