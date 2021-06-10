//Requires
const logged    = require("../middleware/logged")
const chalk     = require("chalk")
const express   = require("express")

//Creates router
const app = new express.Router()


//Introduction Page
app.get("/", (req, res) => {

    //Load view MAIN
    res.render("main",{ })
  
});



//Main Page (Logged only)
app.get("/home", logged, (req, res) => {

    //Load view MAIN
    res.render("home",{ })
  
});


//Export router
module.exports = app