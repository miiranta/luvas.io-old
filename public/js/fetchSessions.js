//FETCH SESSIONS / SESSION 
  
    //Delete all Sessions  
    function deleteAllSessions(sessionToDelete){  
    $(".session").remove();  
    $.ajax({
    contentType: 'application/json',
    method: 'DELETE',
    url: '/session/all'
    }
    )}
    
    //Delete one Session by jwt
    function deleteSession(sessionToDelete, itemId){  
    $("#"+itemId).remove();  
    $.ajax({
    contentType: 'application/json',
    data: JSON.stringify({ sessionToDelete }),
    method: 'DELETE',
    url: '/session'
    })}