//Requires
const App  = require("../db/models/apps")

//Vars
var page = 0;
var pagesize = 10
var words


//Fetch apps (Main)
const fetchApps = async (condition, page, sort)=> {

    return await App.find(condition)
        .limit(pagesize)
        .skip(page*pagesize)
        .sort(sort)

}


//Fetch apps by term
const fetchAppsByTerm = async (owner, title, page, sort)=>{

    //Remove special characters
    var titleTrim = title.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');

    //Make regex
    words = titleTrim.split(" ")
    var regex = new RegExp(Object.values(words).join("|"),"g")

    //Make request
    if(owner){
        //Search with owner
        return await fetchApps({ $and: [ { $or: [{title: regex },{description: regex}] }, {owner} ] } , page, sort)
    }
        //Search without owner
        return await fetchApps({ $and: [ { $or: [{title: regex },{description: regex}] }] } , page, sort)


}

//fetchAppsByTerm("60c9145e81a5fb0a50311064","aaaa iai", 0, '-createdOn').then((x)=>{console.log(x)})