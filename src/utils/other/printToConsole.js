const chalk = require("chalk");

function printToConsole(label, txt1, txt2, txt3){

    switch(label){

        //Server warnings/startup
        case 'server':
            console.log(chalk.magenta.bold("[Server] ") + chalk.green(txt1) + chalk.blue(txt2) + chalk.green(txt3))
            break;
        
        //Database warnings/startup
        case 'database':
            console.log(chalk.magenta.bold("[Database] ") + chalk.green(txt1) + chalk.blue(txt2) + chalk.green(txt3))
            break;

        //Nick/Bio/ProfilePicture updates
        case 'profile':
            console.log(chalk.magenta.bold("[Profile] ") + chalk.green(txt1) + chalk.blue(txt2) + chalk.green(txt3))
            break;

        //App creation/update/delete
        case 'app':
            console.log(chalk.magenta.bold("[App] ") + chalk.green(txt1) + chalk.blue(txt2) + chalk.green(txt3))
            break;

        //Login/logout/sessions
        case 'session':
            console.log(chalk.magenta.bold("[Session] ") + chalk.green(txt1) + chalk.blue(txt2) + chalk.green(txt3))
            break;

        //Warning
        case 'warning':
            console.log(chalk.red.bold("[Warning] ") + chalk.yellow(txt1)) 
            break;

        //Errors
        case 'error':
            console.log(chalk.red.bold("[Error] ") + chalk.red(txt1)) 
            break;

        default:
            break;

    }

    

}

module.exports = printToConsole