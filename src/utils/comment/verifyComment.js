const maxLength = 500;

//Thats for serverside verification, it uses the entire object
const verifyComment = async (comment)=>{

    //Too big / too small
    if(JSON.stringify(comment).length>maxLength){return "Comments must have less than 500 characters!"}

    //Everything is fine
    return false;

}

//Thats for socket verification, it uses some parameters
const verifyCommentSocket = async (comment)=>{

    //Too big / too small
    if(comment.size>maxLength){return "Comments must have less than 500 characters!"}

    //Everything is fine
    return false;

}

module.exports = {verifyComment, verifyCommentSocket}