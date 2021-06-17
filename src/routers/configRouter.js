//Requires
const logged        = require("../middleware/logged")
const chalk         = require("chalk")
const express       = require("express")
const upload        = require("../middleware/imageUpload")
const sharp         = require("sharp")
const User          = require("../db/models/users")
const verifyNick    = require("../utils/verifyNick")

//Creates router
const app = new express.Router()


//Account page (Logged only)
app.get("/account", logged(0), (req, res) => {

        var token = req.user.token
     
        //Every session except the one you are using
        const openSessions = req.user.tokens.filter((tokenFound)=> {return token !== tokenFound.token})

        //The session you are using
        const yourSession = req.user.tokens.filter((tokenFound)=> {return token == tokenFound.token})

    //Load view ACCOUNT
    res.render("account",{ 
        req,
        openSessions,
        yourSession: yourSession[0]
    })

});


//Nick Update
app.patch("/account/nick", logged(0), async (req, res) => {

    const nick = req.body.nick
    var verify

    //Verify nick
    await verifyNick(nick).then((data)=>{verify = data})
        
    //If true > Error
    if(verify){
        return res.status(400).send()
    }
    
    //Everything is fine
    await User.updateOne({_id: req.user._id},{nick})

    console.log(chalk.magenta.bold("[Config] ") + chalk.green("Nick change: ") + chalk.blue(req.user.email) + chalk.green(" to ") + chalk.blue(nick)) 
    res.send()

})


//Image upload
app.patch("/account/picture", logged(0), upload.single("file"), async (req,res)=>{

    //Test for Error
    if(req.fileError){return res.status(400).send(req.fileError)}

    //Process image > PNG 96x96
    try{
        const buffer = await sharp(req.file.buffer).resize({width: 150, height: 150}).png().toBuffer()
        req.user.profilePic = "data:image/png;base64," + buffer.toString('base64')
    }catch(error){
        return res.status(400).send({"message":"Unable to process file"})
    }
    
    //Save on DB
    await User.updateOne({_id: req.user._id},{profilePic: req.user.profilePic})

    console.log(chalk.magenta.bold("[Config] ") + chalk.green("Profile picture change: ") + chalk.blue(req.user.email)) 
    res.send()

}, (error, req, res, next) =>{

    //If error happens
    console.log(chalk.magenta.bold("[Config] ") + chalk.red("Could not update profile picture! ")) 
    res.status(400).send(error)
   
})









//Export router
module.exports = app
