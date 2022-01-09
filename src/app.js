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
const appRouter       = require("./routers/appRouter")
const socketLoad      = require("./sockets")
require('./db/mongoose.js')


const app = express();
const server = http.createServer(app)
const io = socketio(server);
app.set('io', io);

socketLoad(io)

const port = process.env.PORT || 3000;

const publicDirectory = path.join(__dirname, "../public") 
const viewsDirectory = path.join(__dirname, "../templates/views") //HBS views
const partialsDirectory = path.join(__dirname, "../templates/partials") //HBS partials

app.set("view engine","hbs")
app.set("views", viewsDirectory)
hbs.registerPartials(partialsDirectory)
hbs.registerHelper('ifCond', function (v1, operator, v2, options) {
  switch (operator) {
      case '==':
          return (v1 == v2) ? options.fn(this) : options.inverse(this);
      case '===':
          return (v1 === v2) ? options.fn(this) : options.inverse(this);
      case '!=':
          return (v1 != v2) ? options.fn(this) : options.inverse(this);
      case '!==':
          return (v1 !== v2) ? options.fn(this) : options.inverse(this);
      case '<':
          return (v1 < v2) ? options.fn(this) : options.inverse(this);
      case '<=':
          return (v1 <= v2) ? options.fn(this) : options.inverse(this);
      case '>':
          return (v1 > v2) ? options.fn(this) : options.inverse(this);
      case '>=':
          return (v1 >= v2) ? options.fn(this) : options.inverse(this);
      case '&&':
          return (v1 && v2) ? options.fn(this) : options.inverse(this);
      case '||':
          return (v1 || v2) ? options.fn(this) : options.inverse(this);
      default:
          return options.inverse(this);
  }
});

app.use(express.static(publicDirectory))

app.use(express.json())

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(authRouter)
app.use(configRouter)
app.use(contentRouter)
app.use(appRouter)

server.listen(port, () => {
  console.log(chalk.magenta.bold("[Server] ") + chalk.green("Server is up! Using port: ") + chalk.blue(port)) 
});

module.exports = io