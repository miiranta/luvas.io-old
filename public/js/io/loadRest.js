//Emit function
function conRest(url, httpReqType, dataToSend, callback){
    var dataToSendFiltered = JSON.stringify(dataToSend)
    
    $.ajax({
        data: dataToSendFiltered,
        contentType: 'application/json',
        method: httpReqType,
        url,
        success: function() {callback()}
    })
}