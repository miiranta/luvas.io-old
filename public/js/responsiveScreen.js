//Evaluate Screen Proportion and set classes
var block = 0
var state = 3

function defineProportion(){

    var maxProportion = 1;

    block = 1

    var height = window.innerHeight;
    var width = window.innerWidth;
    var proportion = height/width;

    if(proportion<maxProportion){
        if(state == 0 || state == 3){
            $(".mobile").hide()
            $(".desktop").show() 
            console.log("Changed to Desktop")
        }
        state = 1;
    }else{
        if(state == 1 || state == 3){
            $(".mobile").show()
            $(".desktop").hide()
            console.log("Changed to Mobile")
        }
        state = 0;
    }

    block = 0
}
    
$(window).resize( function (){
    if(block == 0){defineProportion()};
    
    setTimeout(function() {/*Boo*/}, 300)
});
    
$(document).ready(
    function (){
        setTimeout(function() {defineProportion();}, 300)
    }
);



//Warning
function openWarning({title, content, buttons: {okayBnt, closeBnt}}){
    
    if(okayBnt){
        $('.okayWarning').show();
        $('.okayWarning').attr('onclick', okayBnt);
    }else{
        $('.okayWarning').hide();
    }

    if(closeBnt){
        $('.closeWarning').show();
        $('.closeWarning').attr('onclick', closeBnt);
    }else{
        $('.closeWarning').hide();
    }

    if(title){
        $('.warningTitleContent').text(title);
    }else{
        $('.warningTitleContent').text("");
    }

    if(content){
        $('.warningScroll').empty();
        $('.warningScroll').append(content);
    }else{
        $('.warningScroll').text("");
    }

    $('.warning').show();

}

function closeWarning(){
    $('.warning').hide();
}


    
//Nav Bar
var lockOpen = 1;
var openNav = 0;

window.onscroll = function() {
    if(lockOpen == 0){
        scrollFunction()
    }
};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20 ) {
        navShow()
    } else {
        navHide()
    }
}

$(document).ready(
    function (){
       $(".navLock").click(function (){  
            if(lockOpen == 0){
                $(".navLock").text("⚫");
                $(".navLockWarning").text("locked");
                lockOpen = 1;
            }else{
                $(".navLock").text("⚪");
                $(".navLockWarning").text("");
                lockOpen = 0;
            }
        }); 

        $(".navOpen").click(function (){  
            if(openNav == 1){
                navHide();
            }else{
                navShow();
            }
        }); 
    }
);

function navShow(){
    anime({
        targets: '.nav',
        translateY: 50,
        duration: 400
    });

    anime({
        targets: '.navOpenText',
        rotate: '-180deg',
        translateY: 11,
        duration: 400
    });

    openNav = 1;
}

function navHide(){
    anime({
        targets: '.nav',
        translateY: 0,
        duration: 400
    });

    anime({
        targets: '.navOpenText',
        rotate: '0deg',
        translateY: 0,
        duration: 400
    });

    openNav = 0;
}

$(document).ready(function (){
    $("#navBarLocation").html(document.title);
})











