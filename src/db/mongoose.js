const mongoose = require('mongoose');
const chalk    = require("chalk")

mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;

db.on('error', function() { console.log(chalk.magenta.bold("[Database] ")+chalk.red("Error!")) })
db.once('open', function() { console.log(chalk.magenta.bold("[Database] ")+chalk.green("Connected!")) })

