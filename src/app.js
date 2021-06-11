//Requires
const http            = require("http")
const express         = require('express')
const socketio        = require("socket.io")
const chalk           = require("chalk")
const hbs             = require('hbs')
const path            = require("path")
const passport        = require('passport')
const cookieSession   = require("cookie-session")
const authRouter      = require("./routers/authRouter")
const contentRouter   = require("./routers/contentRouter")
const configRouter    = require("./routers/configRouter")
const socketLoad      = require("./sockets/sockets")
require('./db/mongoose.js')


//(Express + Websocket) Settings
const app = express();
const server = http.createServer(app)
const io = socketio(server);
app.set('io', io);

//Load websockets
socketLoad(io)

//Port
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
app.use(configRouter)
app.use(contentRouter)

//Server listener
server.listen(port, () => {
  console.log(chalk.blue("Server is up! On port: " + chalk.green.bold(port)))
});

//Export IO
module.exports = io