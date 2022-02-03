const App           = require("../../db/models/apps");
const User          = require("../../db/models/users");

async function updateProfileStats(profile){
    const appOwner = profile._id.toString()
    
    const counts = await App.aggregate([
        {$match:{'owner': appOwner}},
        {$group:{
                _id: appOwner,
                totalLikes : {
                        $sum : "$likeCount"
                        },
                totalViews : {
                        $sum : "$viewCount"
                        }
                }
        }
    ]);

    await User.updateOne({_id: appOwner}, {likeCount: counts[0].totalLikes, viewCount: counts[0].totalViews});
    
    return;
}

module.exports = updateProfileStats;