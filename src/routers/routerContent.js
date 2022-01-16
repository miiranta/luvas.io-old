const logged    = require("../middleware/logged")
const redirect  = require("../middleware/redirect")
const chalk     = require("chalk")
const express   = require("express")
const User      = require("../db/models/users")
const App       = require("../db/models/apps")

const router = new express.Router()


//Introduction Page
router.get("/", (req, res) => {

    res.render("main",{req})
  
});

//Main Page (Logged only)
router.get("/home", logged(0), (req, res) => {

    res.render("home",{req})
  
});

//Profile Page
router.get("/user/:id", redirect, async (req, res) => {

    const user = await User.findOne({"nick": req.params.id})
    if(user){
        req.profile = user;
        res.render("user",{req})
    }else{
        res.redirect("/home")
    }

});

//Post Page
router.get("/post/:id", redirect, async (req, res) => {

    const appData = await App.findOne({"name": req.params.id})
    
    //App registered?
    if(appData){

        //Is Public?
        if(!appData.public){
            if(!req.user){
                return res.redirect("/login");
            }
            if(appData.owner != req.user._id){
                return res.redirect("/home");
            }
        }

        //Find owner data
        const user = await User.findOne({"_id": appData.owner})
        if(user){
            req.profile = user;
            req.profile.foundUser = true;
        }

        req.post = appData;
        res.render("post", {req})

    }else{
        res.redirect("/home")
    }

});

router.get("/post", logged(0), async (req, res) => {
    res.redirect("/home")
});



module.exports = router