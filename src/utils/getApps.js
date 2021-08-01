const App  = require("../db/models/apps")

var page = 0;
var pagesize = 10
var words

const fetchApps = async (condition, page, sort)=> {

    return await App.find(condition)
        .limit(pagesize)
        .skip(page*pagesize)
        .sort(sort)

}

//Fetch apps by term
const fetchAppsByTerm = async (owner, title, page, sort)=>{

    var titleTrim = title.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');

    words = titleTrim.split(" ")
    var regex = new RegExp(Object.values(words).join("|"),"g")

    if(owner){
        //Search with owner
        return await fetchApps({ $and: [ { $or: [{title: regex },{description: regex}] }, {owner} ] } , page, sort)
    }
        //Search without owner
        return await fetchApps({ $and: [ { $or: [{title: regex },{description: regex}] }] } , page, sort)


}
