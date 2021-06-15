//Requires
const validator = require("validator")
const App       = require("../db/models/apps")


const verifyAppCreate = async (data)=>{

///Contain special character?
var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
if(format.test(data.title)){return "Don't use special characters in the title!"} 
if(format.test(data.name)){return "Don't use special characters in the app name!"} 

//Contain spaces?
if(/\s/g.test(data.name)){return "App name can't have spaces!"}

//Too big / too small
if(data.title.length>20||data.title.length<5){return "Titles need to have between 5 and 30 characters!"}
if(data.title.length>20||data.name.length<5){return "App names need to have between 5 and 20 characters!"}
if(data.description.length>500){return "Descriptions can't exceed 500 characters!"}
if(data.url.length>500){return "URLs can't exceed 500 characters!"}
if(data.name.length>20){return "App names can't exceed 20 characters!"}

//Spaces?
if(/\s/g.test(data.name)){return "App names can't have spaces!"}

//Link ok? (Validator)
if(data.local == false){
    if(!validator.isURL(data.url)){return "Add a valid URL!"}
}

//App name exists?
const app = await App.findOne({name: data.name})
if(app){return "App name already taken!"}

//Everything is right
return false


}


module.exports = verifyAppCreate