var request = require('axios')

const getProfilePic = async (link) => {

    //Exists?
    if(link){
        //YES
        const image = await request.get(link, {responseType: 'arraybuffer'});
        var dataPic = "data:image/png;base64, " + Buffer.from(image.data).toString('base64');
        return dataPic
    }else{
        //NO > Default
        dataPic = "/img/profile.png"
    }

}

module.exports = getProfilePic