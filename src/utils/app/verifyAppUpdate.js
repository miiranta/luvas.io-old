const validator         = require("validator")
const App               = require("../../db/models/apps")

const verifyAppUpdate = async (data)=>{

//Contain special character?
var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
if(format.test(data.title)){return "Don't use special characters in the title!"} 

//Too big / too small
if(data.title.length>20||data.title.length<5){return "Titles need to have between 5 and 30 characters!"}
if(data.description.length>500){return "Descriptions can't exceed 500 characters!"}
if(data.url.length>500){return "URLs can't exceed 500 characters!"}

//Link ok? (Validator)
if(data.local == false){
    if(!validator.isURL(data.url)){return "Add a valid URL!"}
}

return false

}


module.exports = verifyAppUpdate