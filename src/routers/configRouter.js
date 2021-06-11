//Requires
const logged    = require("../middleware/logged")
const chalk     = require("chalk")
const express   = require("express")
const upload    = require("../middleware/imageUpload")
const sharp     = require("sharp")

//Creates router
const app = new express.Router()



//Image upload
app.post("/account/picture", logged, upload.single("avatar"), async (req,res)=>{

    //Process image > PNG 96x96
    const buffer = await sharp(req.file.buffer).resize({width: 96, height: 96}).png().toBuffer()
    req.user.profilePic = "data:image/png;base64," + buffer

    //Save on DB
    await req.user.save()

    //Res
    res.send()

}, (error, req, res, next) =>{

    //If error happens
    res.status(400).send()

})



//Account page (Logged only)
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
