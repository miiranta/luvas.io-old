const App               = require("../../db/models/apps");

async function randomApp(){
    var options = {public: true, auth: false};
    var count           = await App.countDocuments(options);
    var randomNumber    = Math.floor(Math.random() * count);
    var randomApp       = await App.findOne(options).skip(randomNumber);

    if(randomApp){
        return {status: 200, redirect: "/post/" + randomApp.name}
    }

    return {status: 404, redirect: "/home"}
}
    

module.exports = randomApp