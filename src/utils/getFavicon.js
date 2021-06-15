//Requires
var Favicon = require('node-get-favicon')

//Vars
var imgData
var favicon = new Favicon({
  verboseMode: true
})

//Get Favicon
const getIcon = async (link) => {

//Request
const data = await favicon.getFavicon(link)
  .then(function (data) {
    imgData = "data:image/png;base64, " + data.data.toString('base64')
    return imgData
})
  .catch(function (e) {
    return "/img/default-app-icon.png"
})

//Bug fix
if(data == "data:image/png;base64, "){return "/img/default-app-icon.png"}
return data

}


module.exports = getIcon










