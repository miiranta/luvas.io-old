const chalk     = require("chalk")
const express   = require("express")
const logged    = require("../middleware/logged")
const App       = require("../db/models/apps")

//Creates router
const app = new express.Router()

//App creation Page (Admin only for now)
app.get("/app", logged(1), (req, res) => {

    //Load view APP
    res.render("app",{

        


    })
  
});



//App redirect 
app.get("/app/:id", logged(0), (req, res) => {

    //Load view APP
    res.render("app",{ })
  
});



//Export router
module.exports = app