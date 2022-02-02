const App = require("../../db/models/apps");

async function updateRelevanceScore(oldAppData){
    const app = await App.findOne({_id: oldAppData._id})

    const views = Math.abs(app.viewCount)
    const likes = Math.abs(app.likeCount)
    const age   = (Date.now() - Date.parse(app.createdAt)) / 1000; //In s!

    const likesW   = 20;        //+20 per like
    const viewsW   = 1;         //+1 per view
    const ageW     = -0.00001;  //-0.86 per day

    const totalW = Math.abs(viewsW) + Math.abs(likesW) + Math.abs(ageW);
    const relevanceScore = Math.floor( ( (views*viewsW + likes*likesW + age*ageW)/totalW )*1000000 )

    await App.updateOne({_id: app._id}, {relevanceScore})
}

module.exports = updateRelevanceScore;