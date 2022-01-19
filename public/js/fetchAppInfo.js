function deltaToHTML(inputDelta) {
    var tempCont = document.createElement("div");
    (new Quill(tempCont)).setContents(inputDelta);
    return tempCont.getElementsByClassName("ql-editor")[0].innerHTML;
}

var delta = JSON.parse($('#descRaw').text())

$("#desc").append(deltaToHTML(delta))
$("#descRaw").empty()