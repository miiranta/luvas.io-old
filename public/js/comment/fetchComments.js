var winLocal = window.location.pathname.split("/");
var page = 0
var post = winLocal[2]
var pageSize = 0

//UPDATE
socket.on("comment_" + post, (data)=>{
    noComments(false);
    showComment(data, false);
    pageSize++;
    keepPageSize()
    updateButtons(data)
})

//LOAD
function deltaToHTML(inputDelta) {
    var tempCont = document.createElement("div");
    (new Quill(tempCont)).setContents(inputDelta);
    return tempCont.getElementsByClassName("ql-editor")[0].innerHTML;
}

function showComment(comment, order){
    var appendModel = ` <div class="comment"> 
                            <p>${comment.nick}--------------</p>
                            <p>${comment.createdAt}</p>
                            <p>${deltaToHTML(JSON.parse(comment.content))}</p>
                        </div>`;

    if(order){
        return $("#showComments").append(appendModel)
    }
    return $("#showComments").prepend(appendModel)
}

function noComments(enable){
    if(enable){
         var appendModel = `<div class="comment" id="noComment"> 
                                <p>No comments found :(</p>
                            </div>`;
        $("#showComments").append(appendModel)
    }else{
        $("#noComment").remove()
    }
}

function getComments(){
    var commentData = JSON.stringify({page, post})

    socket.emit("commentLoad", commentData, (data)=>{

        $("#showComments").empty()

        if(data.length == 0){
            pageSize = 0
            noComments(true)
        }else{
            pageSize = data.length
            noComments(false)
            $.each(data, (i, result) => {
                showComment(result, true)
            }) 
        }

        updateButtons()
    })
}

getComments()


//PAGE MANAGEMENT
function updateButtons(){
    if((page-1)>=0){
        $("#previous").prop("disabled", false);
    }else{
        $("#previous").prop("disabled", true);
    }

    if(pageSize >= 10){
        $("#next").prop("disabled", false);
    }else{
        $("#next").prop("disabled", true);
    }
}

$("#previous").on("click", function(){
        page = page - 1;
        $("#page").text(page+1)
        getComments();
})

$("#next").on("click", function(){
        page = page + 1;
        $("#page").text(page+1)
        getComments();  
})

function keepPageSize(){
    if(pageSize > 10){
        $('#showComments').children().last().remove();
    }
}

