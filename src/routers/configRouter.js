//Requires
const logged    = require("../middleware/logged")
const chalk     = require("chalk")
const express   = require("express")
const upload    = require("../middleware/imageUpload")
const sharp     = require("sharp")
const User      = require("../db/models/users")

//Creates router
const app = new express.Router()


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


//Nick Update
app.patch("/account/nick", logged, async (req, res) => {

    const nick = req.body.nick

    //Contain special character?
    var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if(format.test(nick)){return res.status(400).send()}

    //Contain spaces?
    if(/\s/g.test(nick)){return res.status(400).send()}

    //Too big / too small
    if(nick.length>15||nick.length<5){return res.status(400).send()}

    //Search Db for nick taken
    const user = await User.findOne({nick})
    if(user){return res.status(400).send()}

    //Everything is fine
    await User.updateOne({_id: req.user._id},{nick})

    res.send()

})


//Image upload
app.patch("/account/picture", logged, upload.single("file"), async (req,res)=>{

    //Test for Error
    if(req.fileError){return res.status(400).send(req.fileError)}

    //Process image > PNG 96x96
    try{
        const buffer = await sharp(req.file.buffer).resize({width: 96, height: 96}).png().toBuffer()
        req.user.profilePic = "data:image/png;base64," + buffer.toString('base64')
    }catch(error){
        return res.status(400).send({"message":"Unable to process file"})
    }
    
    //Save on DB
    await User.updateOne({_id: req.user._id},{profilePic: req.user.profilePic})

    res.send()

}, (error, req, res, next) =>{

    //If error happens
    res.status(400).send(error)
   
})









//Export router
module.exports = app
