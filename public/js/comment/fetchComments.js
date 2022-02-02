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
    var appendModel = ` <div class="comment row start"> 

                            <div class="col">
                                <div class="start" style="margin: 10px; margin-bottom: 5px;">
                                    <a href="/user/${comment.nick}">
                                    <p class="light">${comment.nick}</p>
                                    </a>
                                </div>

                                <div class="end" style="margin: 10px; margin-bottom: 5px;">
                                    <p class="makeDate shadow2">${comment.createdAt}</p>
                                </div>
                            </div>
                            
                            <!--Show quill content-->
                            <div data-simplebar class="bg-light border1-light" style="max-height: 200px;">
                                <div class="quill" style="width:600px;">
                                    ${deltaToHTML(JSON.parse(comment.content))}
                                </div>
                            </div>
                            
                            <div style="height: 40px;"></div>

                        </div>`;

    if(order){
        $("#comShowComments").append(appendModel);
        formatDates();
        return 
    }
    $("#comShowComments").prepend(appendModel);
    formatDates();
    return 
}

function noComments(enable){
    if(enable){
         var appendModel = `
                           
                            <div class="box1 bg-shadow2 border2-shadow2" id="noComment" style="margin-top: 48px;"> 
                                <div>
                                <p class="light" style="margin-top: 20px;">No comments found ;(</p>
                                </div>
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

