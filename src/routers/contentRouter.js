const logged    = require("../middleware/logged")
const chalk     = require("chalk")
const express   = require("express")
const User      = require("../db/models/users")

const app = new express.Router()


//Introduction Page
app.get("/", (req, res) => {

    res.render("main",{req})
  
});

//Main Page (Logged only)
app.get("/home", logged(0), (req, res) => {

    res.render("home",{req})
  
});

//Profile
app.get("/user/:id", logged(0), async (req, res) => {

    const user = await User.findOne({"nick": req.params.id})
    if(user){
        req.profile = user;
       res.render("user",{req})
    }else{
        res.redirect("/home")
    }

    
    
});


module.exports = app