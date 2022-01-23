//Emit function
function conRest(url, httpReqType, dataToSend, callback){
    var dataToSendFiltered = JSON.stringify(dataToSend)
    
    $.ajax({
        data: dataToSendFiltered,
        method: httpReqType,
        url,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: false,
        success: callback()
    })
}