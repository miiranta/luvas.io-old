const App               = require("../../db/models/apps")
const User              = require("../../db/models/users")
const jwt               = require("jsonwebtoken")
const {sanitizeInput}   = require("../other/sanitizeInput.js")

var page = 0;
var pagesize = 5
var words

const searchAppsOnDb = async (condition, page, sort)=> {
    return await App.find(condition)
    .limit(pagesize)
    .skip(page*pagesize)
    .sort(sort)
}

const prepareSearch = async (title, page, sort, options)=>{

    //Remove special characters
    var titleTrim = title.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');

    //Make regex
    words = titleTrim.split(" ")
    var regex = new RegExp(Object.values(words).join("|"),"g")

    //Make request
        //Search without owner
        return await searchAppsOnDb({ $and: [ { $or: [{title: regex },{name: regex}] }, ...options] } , page, sort)

}

const fetchAppsByData = async (data, socket) => {
        /*
        PARAMS by client
        -search (term)
        -sort   (1, 2, 3...)
        -local  (is local app?)
        -createdByMe    (my apps?)
        -profile        (some profile apps?)
        -page
        */
    
        var options = [];
        var user = null;
        
        try{
            var userJWT = sanitizeInput(socket.handshake.session.passport.user)
            var user = jwt.verify(userJWT, process.env.JWT_SECRET)
            if(!user){throw new Error()}
        }catch(e){
            user = null;
        }

        //Created By Me var
        if(data.createdbyme){   

            if(user){
                options.push({'owner':user._id})
            }else{

                //Public var 
                options.push({'public':true})
            }

        }else{


            //Profile var
            if(data.profile){
                const profileId = await User.findOne({nick: data.profile})
                options.push({owner: profileId._id})
            }

            //Public var
            options.push({'public':true})
        }

        //Search var
        var title = data.search
        if(title.length > 50){
            title = "";
        }

        //local var
        if(data.local == true){
            options.push({'local':true})
        }

        //Sort var
        const sortOptions = [{"relevanceScore": -1}, {"createdAt": -1}, {"createdAt": 1}, {"likeCount": -1}, {"likeCount": 1}, {"viewCount": -1}, {"viewCount": 1}]
        var sort = sortOptions[data.sort]
        
        //Page var
        var page = Math.abs(data.page);

        //Building response
        try{
                var res = prepareSearch(title, page, sort, options).then((primaryRes) => {
                var secondaryRes = primaryRes.map(changeAppsForm)
                var thirdRes = secondaryRes.map(addNick)
                var res = Promise.all(thirdRes).then((res) => {
                    return res;
                })
                return res
            })
            return res;
        }catch(e){
            console.log(e)
            return []
        }
}

const changeAppsForm = (primaryRes) =>{
    primaryRes = {
        edited: primaryRes.edited,
        likeCount: primaryRes.likeCount,
        viewCount: primaryRes.viewCount,
        title: primaryRes.title,
        description: primaryRes.description,
        name: primaryRes.name,
        nick: primaryRes.owner, //Later changed to nick!
        url: primaryRes.url,
        public: primaryRes.public,
        local: primaryRes.local,
        auth: primaryRes.auth,
        picture: primaryRes.picture,
        createdAt: primaryRes.createdAt
    }
    return primaryRes;
}

const addNick = async (secondaryRes) => {
    var profile = await User.findOne({_id: secondaryRes.nick})
    if(profile){    
        secondaryRes['nick'] = profile.nick
    }
    return secondaryRes;
}

module.exports = fetchAppsByData