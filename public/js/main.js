//Variables
    var block = 0
    var winLocal = window.location.pathname.split("/");

//Functions
function deltaToHTML(inputDelta) {
    var tempCont = document.createElement("div");
    (new Quill(tempCont)).setContents(inputDelta);
    return tempCont.getElementsByClassName("ql-editor")[0].innerHTML;
}


