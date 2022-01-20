const User = require("../../db/models/users")

const verifyNick = async (nick)=>{

    //Contain special character?
    var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if(format.test(nick)){return "Nicks can't contain special characters!"}

    //Contain spaces?
    if(/\s/g.test(nick)){return "Nicks can't have spaces!"}

    //Too big / too small
    if(nick.length>15||nick.length<5){return "Nicks need to have between 5 to 15 characters!"}

    //Search Db for nick taken
    const user = await User.findOne({nick})
    if(user){return "Nick already taken!"}

    //Everything is fine
    return false;

}

module.exports = verifyNick