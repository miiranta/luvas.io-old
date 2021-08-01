const logged    = require("../middleware/logged")
const chalk     = require("chalk")
const express   = require("express")

const app = new express.Router()


//Introduction Page
app.get("/", (req, res) => {

    res.render("main",{req})
  
});

//Main Page (Logged only)
app.get("/home", logged(0), (req, res) => {

    res.render("home",{req})
  
});


module.exports = app