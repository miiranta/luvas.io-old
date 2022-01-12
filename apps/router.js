const chalk             = require("chalk")
const express           = require("express")
const logged            = require("../src/middleware/logged")

const app = new express.Router()

//App creation Page (Admin only for now)
app.get("/test", logged(1), (req, res) => {

    res.send("app.html")
  
});

module.exports = app
