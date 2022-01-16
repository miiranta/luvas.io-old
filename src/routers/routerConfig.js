const logged                                = require("../middleware/logged")
const chalk                                 = require("chalk")
const express                               = require("express")
const upload                                = require("../middleware/uploadImage")
const sharp                                 = require("sharp")
const User                                  = require("../db/models/users")
const verifyNick                            = require("../utils/verifyNick")
const verifyBio                             = require("../utils/verifyBio")
const {sanitizeInput, sanitizeObject}       = require("../utils/sanitizeInput.js")

const router = new express.Router()

//Account page (Logged only)
router.get("/account", logged(0), (req, res) => {

        var token = req.user.token
     
        const openSessions = req.user.tokens.filter((tokenFound)=> {return token !== tokenFound.token})

        const yourSession = req.user.tokens.filter((tokenFound)=> {return token == tokenFound.token})

    res.render("account", { 
        user: req.user,
        openSessions,
        yourSession: yourSession[0]
    })

});


//Nick Update
router.patch("/account/nick", logged(0), async (req, res) => {

    const nick = sanitizeInput(req.body.nick)
    var verify

    await verifyNick(nick).then((data)=>{verify = data})
        
    if(verify){
        return res.status(400).send()
    }
    
    await User.updateOne({_id: req.user._id}, {nick})

    console.log(chalk.magenta.bold("[Config] ") + chalk.green("Nick change: ") + chalk.blue(req.user.email) + chalk.green(" account is now ") + chalk.blue(nick)) 
    res.send()

})


//Image upload
router.patch("/account/picture", logged(0), upload.single("file"), async (req,res)=>{

    if(req.fileError){return res.status(400).send(req.fileError)}

    try{
        const buffer = await sharp(req.file.buffer).resize({width: 150, height: 150}).png().toBuffer()
        req.user.profilePic = "data:image/png;base64," + buffer.toString('base64')
    }catch(error){
        return res.status(400).send({"message":"Unable to process file"})
    }
    
    await User.updateOne({_id: req.user._id},{profilePic: req.user.profilePic})

    console.log(chalk.magenta.bold("[Config] ") + chalk.green("Profile picture change: ") + chalk.blue(req.user.email)) 
    res.send()

}, (error, req, res, next) =>{

    console.log(chalk.magenta.bold("[Config] ") + chalk.red("Could not update profile picture! ")) 
    res.status(400).send(error)
   
})


//Bio update
router.patch("/account/bio", logged(0), async (req, res) => {
    
    var bio = sanitizeInput(req.body.bio)
    var verify

    await verifyBio(bio).then((data)=>{verify = data})
        
    if(verify){
        return res.status(400).send()
    }

    await User.updateOne({_id: req.user._id},{bio})

    res.send()
})



module.exports = router
