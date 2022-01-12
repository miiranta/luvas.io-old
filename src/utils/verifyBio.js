const verifyBio = async (bio)=>{

    //Contain special character?
    var format = /[\=\[\]{}'"|<>]+/;
    if(format.test(bio)){return "Biographies can't contain some special characters!"}

    //Too big / too small
    if(bio.length>5000){return "Biographies have to have less than 5000 characters!"}

    //Everything is fine
    return false;

}

module.exports = verifyBio