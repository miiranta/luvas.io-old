//Requires
const logged    = require("../middleware/logged")
const chalk     = require("chalk")
const express   = require("express")

//Creates router
const app = new express.Router()


//Home Page (Logged only)
app.get("/account", logged, (req, res) => {

    //Load view MAIN
    res.render("account",{ })
  
});












//Export router
module.exports = app
