const logged                                = require("../middleware/logged")
const redirect                              = require("../middleware/redirect")
const chalk                                 = require("chalk")
const express                               = require("express")
const User                                  = require("../db/models/users")
const App                                   = require("../db/models/apps")
const {sanitizeInput, sanitizeObject}       = require("../utils/sanitizeInput.js")

const router = new express.Router()


//Introduction Page
router.get("/", (req, res) => {

    res.render("main")
  
});

//Home Page (Logged only)
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


module.exports = router