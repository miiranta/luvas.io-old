//Requires
const express         = require("express");
const chalk           = require("chalk")
const hbs             = require('hbs')
const path            = require("path")
const passport        = require('passport')
const cookieSession   = require("cookie-session")
const authRouter      = require("./routers/authRouter")
require('./db/mongoose.js')

//Express Settings
const app = express();
const port = process.env.PORT || 3000;

//Directories
const publicDirectory = path.join(__dirname, "../public") 
const viewsDirectory = path.join(__dirname, "../templates/views") //HBS views
const partialsDirectory = path.join(__dirname, "../templates/partials") //HBS partials

//Setup HBS
app.set("view engine","hbs")
app.set("views", viewsDirectory)
hbs.registerPartials(partialsDirectory)

//Setup standard directory
app.use(express.static(publicDirectory))

//Parse json
app.use(express.json())

//Define Cookie session
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))

//Passport setup
app.use(passport.initialize());
app.use(passport.session());

//Routers
app.use(authRouter)

//Server listener
app.listen(port, () => {
  console.log(chalk.blue("Server is up! On port: " + chalk.green.bold(port)))
});
