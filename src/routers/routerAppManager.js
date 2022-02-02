const express                               = require("express")
const logged                                = require("../middleware/logged")
const redirect                              = require("../middleware/redirect")
const App                                   = require("../db/models/apps")
const {sanitizeInput, sanitizeObject}       = require("../utils/other/sanitizeInput.js")
const createApp                             = require("../utils/app/createApp")
const editApp                               = require("../utils/app/editApp")
const deleteApp                             = require("../utils/app/deleteApp")
const { unsaveApp, saveApp }                = require("../utils/app/saveApp")
const redirectToApp                         = require("../utils/app/redirectToApp")
const randomApp                             = require("../utils/app/randomApp")

const router = new express.Router()

//App create Page (Admin only for now)
router.get("/app", logged(1), (req, res) => {
    res.render("app", {user: sanitizeObject(req.user)})
});

//App edit Page
router.get("/edit/:id", logged(0), async (req, res) => {
    const appData = await App.findOne({"name": sanitizeInput(req.params.id)})
    
    //App registered?
    if(appData){
        req.post = appData;

        //App owner trying to edit?
        if(appData.owner == req.user._id){
            return res.render("edit", {post: appData, user: req.user})
        }
        return res.redirect("/home")
    }  
    return res.redirect("/home")
    
})

//App redirect 
router.get("/app/:id", redirect, async (req, res) => {
    const codeRes = await redirectToApp(req) 
    if(codeRes.redirect){
        res.redirect(codeRes.redirect)
    }
    res.status(codeRes.status).send()
});

//App create
router.post("/app", logged(1), async (req, res) => {
    const codeRes = await createApp(req)
    res.status(codeRes.status).send()
});

//App edit
router.post("/edit/:id", logged(0), async (req, res) => {
    const codeRes = await editApp(req)
    res.status(codeRes.status).send()
});

//App delete
router.get("/delete/:id", logged(0), async (req, res) => {
    const codeRes = await deleteApp(req)
    if(codeRes.redirect){
        res.redirect(codeRes.redirect)
    }
    res.status(codeRes.status).send()
})

//App Save
router.post("/save/:id", logged(0), async (req, res) => {
    const codeRes = await saveApp(req)
    res.status(codeRes.status).send()
})

//App Unsave
router.post("/unsave/:id", logged(0), async (req, res) => {
    const codeRes = await unsaveApp(req) 
    res.status(codeRes.status).send()
})

//App random
router.get("/random", async (req, res) => {
    const codeRes = await randomApp()
    if(codeRes.redirect){
        res.redirect(codeRes.redirect)
    }
    res.status(codeRes.status).send()
})

module.exports = router