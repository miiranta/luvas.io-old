//Requires
const express = require("express")
const Auth    = require("../db/models/auth")
const hbs     = require('hbs')

//Creates router
const app = new express.Router()

//Routes
app.get("/", (req, res) => {

    //Load view WELCOME
    res.render("welcome",{ })
  
});
  




//Export router
module.exports = app
