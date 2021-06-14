const chalk     = require("chalk")
const express   = require("express")
const logged = require("../middleware/logged")

//Creates router
const app = new express.Router()

//App creation Page (Admin only)
app.get("/app", logged(1), (req, res) => {

    //Load view APP
    res.render("app",{ })
  
});



//Export router
module.exports = app