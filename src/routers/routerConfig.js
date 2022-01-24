const logged                                = require("../middleware/logged")
const express                               = require("express")
const upload                                = require("../middleware/uploadImage")
const updateNick                            = require("../utils/profile/updateNick")
const updateProfilePic                      = require("../utils/profile/updateProfilePic")
const updateBio                             = require("../utils/profile/updateBio")
const printToConsole = require("../utils/other/printToConsole")

const router = new express.Router()

//Account page (Logged only)
router.get("/account", logged(0), (req, res) => {
    const token         = req.user.token
    const openSessions  = req.user.tokens.filter((tokenFound)=> {return token !== tokenFound.token})
    const yourSession   = req.user.tokens.filter((tokenFound)=> {return token == tokenFound.token})

    res.render("account", { 
        user: req.user,
        openSessions,
        yourSession: yourSession[0]
    })
});

//Nick Update
router.patch("/account/nick", logged(0), async (req, res) => {
    const codeRes = await updateNick(req) 
    res.status(codeRes.status).send()
})

//Image upload
router.patch("/account/picture", logged(0), upload.single("file"), async (req,res)=>{
    const codeRes = await updateProfilePic(req) 
    res.status(codeRes.status).send()
}, (error, req, res, next) =>{
    printToConsole('warning', 'Could not update profile picture!')
    res.status(400).send()
})

//Bio update
router.patch("/account/bio", logged(0), async (req, res) => {
    const codeRes = await updateBio(req) 
    res.status(codeRes.status).send()
})

module.exports = router
