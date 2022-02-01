const logged                                = require("../middleware/logged")
const redirect                              = require("../middleware/redirect")
const express                               = require("express")
const path                                  = require('path');
const User                                  = require("../db/models/users")
const App                                   = require("../db/models/apps")
const {sanitizeInput, sanitizeObject}       = require("../utils/other/sanitizeInput.js")
const createComment                         = require("../utils/comment/createComment")

const msgDirectory = path.join(__dirname, "../../templates/messages") 

const router = new express.Router()

//Introduction Page
router.get("/", (req, res) => {
    res.render("main")
});

//Home Page
router.get("/home", logged(0), (req, res) => {
    res.render("home", {user: sanitizeObject(req.user)})
});

//Profile Page
router.get("/user/:id", redirect, async (req, res) => {
    const profile = await User.findOne({"nick": sanitizeInput(req.params.id)})
    if(profile){
        res.render("user", {profile})
    }else{
        res.redirect("/home")
    }
});

//Post Page
router.get("/post/:id", redirect, async (req, res) => {
    const post = await App.findOne({"name": sanitizeInput(req.params.id)})
    
    //App registered?
    if(post){

        //Is Public?
        if(!post.public){
            if(!req.user){
                return res.redirect("/login");
            }
            if(post.owner != req.user._id){
                return res.redirect("/home");
            }
        }

        //Find owner data
        const profile = await User.findOne({"_id": post.owner})
        res.render("post", {post, profile, user: req.user})

    }else{
        res.redirect("/home")
    }

});

router.get("/post", logged(0), async (req, res) => {
    res.redirect("/home")
});

//Create Comment
router.post("/post/comment/:id", logged(0), async (req, res) => {
    const codeRes = await createComment(req) 
    res.status(codeRes.status).send()
});

//Msgs
router.get("/msg/faq", async (req, res) => {
    res.sendFile(msgDirectory + "/faq.html")
});
router.get("/msg/privacypolicy", async (req, res) => {
    res.sendFile(msgDirectory + "/privacyPolicy.html")
});
router.get("/msg/softwarelicenses", async (req, res) => {
    res.sendFile(msgDirectory + "/softwareLicenses.html")
});
router.get("/msg/termsofservice", async (req, res) => {
    res.sendFile(msgDirectory + "/termsOfService.html")
});


module.exports = router