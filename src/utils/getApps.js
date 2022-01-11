//Requires
const App       = require("../db/models/apps")
const jwt       = require("jsonwebtoken")

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
const fetchAppsByTerm = async (title, page, sort, options)=>{

    //Remove special characters
    var titleTrim = title.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');

    //Make regex
    words = titleTrim.split(" ")
    var regex = new RegExp(Object.values(words).join("|"),"g")

    //Make request
        //Search without owner
        return await fetchApps({ $and: [ { $or: [{title: regex },{description: regex}] }, ...options] } , page, sort)

}

const fetchAppsByData = async (data, socket) => {

        var data

        var options = [];
        var user = null;
        
        try{
            var userJWT = socket.handshake.session.passport.user
            var user = jwt.verify(userJWT, process.env.JWT_SECRET)
            if(!user){throw new Error()}
        }catch(e){
            user = null;
        }

        //Created By Me
        if(data.createdbyme){   

            if(user){
                options.push({'owner':user._id})
            }else{

                //Public
                options.push({'public':true})
            }

        }else{

            //Public
            options.push({'public':true})
        }

        
        //Search
        var title = data.search

        //local
        if(data.local == true){
            options.push({'local':true})
        }

        //Sort
        const sortOptions = [{"createdAt": -1}, {"createdAt": 1}]
        var sort = sortOptions[data.sort]
        
        //Page
        var page = Math.abs(data.page);

        return fetchAppsByTerm(title, page, sort, options)
}


module.exports = fetchAppsByData