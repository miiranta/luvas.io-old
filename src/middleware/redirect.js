const redirect = async (req, res, next) => {

    //redirect system
    var redirect
    if(req.originalUrl){redirect = req.originalUrl}else{redirect = "/home"}
    if(redirect == "/login"){redirect = "/home"}
    if(redirect == "/logout"){redirect = "/home"}
    req.session.redirect = redirect

    next()

}

module.exports = redirect