//Requires
const logged    = require("../middleware/logged")
const chalk     = require("chalk")
const express   = require("express")

//Creates router
const app = new express.Router()


//Home Page (Logged only)
app.get("/account", logged, (req, res) => {

        var token = req.user.token
     
        //Every session except the one you are using
        const openSessions = req.user.tokens.filter((tokenFound)=> {return token !== tokenFound.token})

        //The session you are using
        const yourSession = req.user.tokens.filter((tokenFound)=> {return token == tokenFound.token})

    //Load view MAIN
    res.render("account",{ 

        name: req.user.name,
        email: req.user.email,
        nick: req.user.nick,
        profilePic: req.user.profilePic,
        openSessions,
        yourSession: yourSession[0]

    })

  

});














//Export router
module.exports = app
