const bodyIndex = window.parent.document.body;

function bold(element){
    if (element){
        bodyIndex.addClassName(".bold")
    } else{
        BodyIndex.classList.remove("bold")
    }
}
function italic(element){  
    if (element){
        bodyIndex.addClassName(".italic")
    } else{
        BodyIndex.classList.remove(".italic")
    }
}
function underline(element){  
    if (element){
        bodyIndex.addClassName(".underline")
    } else{
        BodyIndex.classList.remove(".underline")
    }
}
/*function markup(element){  
    if (element){
        bodyIndex.addClassName(".markup")
    } else{
        BodyIndex.classList.remove("markup")
    }
}*/

function dark(element){}
function font(element){}
