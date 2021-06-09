//Requires
const mongoose = require('mongoose');
const chalk    = require("chalk")

//Connect Database 
mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;

//Errors?
db.on('error', console.error.bind(console, chalk.red('Connection Error:')))
db.once('open', function() { console.log(chalk.blue("Database is up!")) })

