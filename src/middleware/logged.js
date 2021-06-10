const logged = (req, res, next) => {

    //Verify if user is logged
    if(req.user){
        next()
    } else {
        res.redirect("/login")
    }

}

module.exports = logged