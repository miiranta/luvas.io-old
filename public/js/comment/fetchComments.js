var comPage = 0
var comPageSize = 0

//UPDATE
socket.on("comment_" + winLocal[2], (data)=>{
    noComments(false);
    showComment(data, false);
    comPageSize++;
    comKeepPageSize()
    comUpdateButtons(data)
})

//LOAD
function showComment(comment, order){
    var appendModel = ` <div class="comment"> 
                            <p>${comment.nick}--------------</p>
                            <p>${comment.createdAt}</p>
                            <p>${deltaToHTML(JSON.parse(comment.content))}</p>
                        </div>`;

    if(order){
        return $("#comShowComments").append(appendModel)
    }
    return $("#comShowComments").prepend(appendModel)
}

function noComments(enable){
    if(enable){
         var appendModel = `<div class="comment" id="noComment"> 
                                <p>No comments found :(</p>
                            </div>`;
        $("#comShowComments").append(appendModel)
    }else{
        $("#noComment").remove()
    }
}

function getComments(){
    var commentData = {page: comPage, post: winLocal[2]}

    conSocket("commentLoad", commentData, (data)=>{

        $("#comShowComments").empty()

        if(data.length == 0){
            comPageSize = 0
            noComments(true)
        }else{
            comPageSize = data.length
            noComments(false)
            $.each(data, (i, result) => {
                showComment(result, true)
            }) 
        }

        comUpdateButtons()
    })
}

getComments()

//PAGE MANAGEMENT
function comUpdateButtons(){
    if((comPage-1)>=0){
        $("#comPrevious").prop("disabled", false);
    }else{
        $("#comPrevious").prop("disabled", true);
    }

    if(comPageSize >= 10){
        $("#comNext").prop("disabled", false);
    }else{
        $("#comNext").prop("disabled", true);
    }
}

$("#comPrevious").on("click", function(){
        comPage = comPage - 1;
        $("#comPage").text(comPage+1)
        getComments();
})

$("#comNext").on("click", function(){
        comPage = comPage + 1;
        $("#comPage").text(comPage+1)
        getComments();  
})

function comKeepPageSize(){
    if(comPageSize > 10){
        $('#comShowComments').children().last().remove();
    }
}

