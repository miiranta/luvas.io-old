const maxLength = 10000000;

//Thats for serverside verification, it uses the entire object
const verifyBio = async (bio)=>{

    //Too big / too small
    if(bio.length>maxLength){return "Biography is taking too much space!"}

    //Everything is fine
    return false;

}

//Thats for socket verification, it uses some parameters
const verifyBioSocket = async (bio)=>{

    //Too big / too small
    if(bio.size>maxLength){return "Biography is taking too much space!"}

    //Everything is fine
    return false;

}

module.exports = {verifyBio, verifyBioSocket}