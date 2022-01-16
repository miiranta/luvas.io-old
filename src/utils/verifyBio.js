const verifyBio = async (bio)=>{

    //Too big / too small
    if(bio.length>5000){return "Biographies have to have less than 5000 characters!"}

    //Everything is fine
    return false;

}

module.exports = verifyBio