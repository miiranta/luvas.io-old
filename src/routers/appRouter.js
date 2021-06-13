const chalk     = require("chalk")
const express   = require("express")
const adminOnly = require("../middleware/adminOnly")

//Creates router
const app = new express.Router()

//App creation Page (Admin only)
console.log("a")
app.get("/app", adminOnly, (req, res) => {

    //Load view APP
    res.render("app",{ })
  
});



//Export router
module.exports = app