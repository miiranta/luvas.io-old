const http              = require("http")
const express           = require('express')
const socketio          = require("socket.io")
const chalk             = require("chalk")
const hbs               = require('hbs')
const path              = require("path")
const passport          = require('passport')
const cookieSession     = require("cookie-session")
const ios               = require('socket.io-express-session');
const routerAuth        = require("./routers/routerAuth")
const routerContent     = require("./routers/routerContent")
const routerConfig      = require("./routers/routerConfig")
const routerAppManager  = require("./routers/routerAppManager")
const loadSockets       = require("./routers/sockets")
const routerLocalApps   = require("../apps/routerLocalApps")
const runLocalapps      = require("../apps/runLocalapps")
const loadHbsHelpers    = require("./utils/loadHbsHelpers")
require('./db/mongoose.js')

const exp = express();
const server = http.createServer(exp)
const port = process.env.PORT || 3000;

const session = cookieSession({
    name: 'session',
    keys: [process.env.SESSION_KEY_1, process.env.SESSION_KEY_1]
})

const io = socketio(server);
io.use(ios(session));
exp.set('io', io);
loadSockets(io)

const publicDirectory = path.join(__dirname, "../public") 
const viewsDirectory = path.join(__dirname, "../templates/views") //HBS views
const partialsDirectory = path.join(__dirname, "../templates/partials") //HBS partials

exp.set("view engine","hbs")
exp.set("views", viewsDirectory)
hbs.registerPartials(partialsDirectory)
loadHbsHelpers();

exp.use(express.static(publicDirectory))

exp.use(express.json({limit: '20mb'}))

exp.use(session)

exp.use(passport.initialize());
exp.use(passport.session());

exp.use(routerAuth)
exp.use(routerConfig)
exp.use(routerContent)
exp.use(routerAppManager)
exp.use(routerLocalApps)

server.listen(port, () => {
    console.log(chalk.magenta.bold("[Server] ") + chalk.green("Server is up! Using port: ") + chalk.blue(port))
    runLocalapps();
});


module.exports = io