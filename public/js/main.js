//Variables
    var block = 0
    var winLocal = window.location.pathname.split("/");

//Functions
function deltaToHTML(inputDelta) {
    var tempCont = document.createElement("div");
    (new Quill(tempCont)).setContents(inputDelta);
    return tempCont.getElementsByClassName("ql-editor")[0].innerHTML;
}

function msgOpenFaq(){
    $.get('/msg/faq', function(content) {
        openWarning({title: "Frequently Asked Questions", content, buttons: {closeBnt: "closeWarning()"}})
    });
}

function msgOpenTermsOfService(){
    $.get('/msg/termsofservice', function(content) {
        openWarning({title: "Terms of Service", content, buttons: {closeBnt: "closeWarning()"}})
    });
}

function msgOpenPrivacyPolicy(){
    $.get('/msg/privacypolicy', function(content) {
        openWarning({title: "Privacy Policy", content, buttons: {closeBnt: "closeWarning()"}})
    });
}

function msgOpenSoftwareLicenses(){
    $.get('/msg/softwarelicenses', function(content) {
        openWarning({title: "Software Licenses", content, buttons: {closeBnt: "closeWarning()"}})
    });
}

