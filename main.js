function changerTab(path,tab){
    const frame=document.getElementById("affichage-contenu");
    frame.src=path;
     document.querySelectorAll(".tab").forEach(tab => tab.classList.remove('actif'));
    tab.classList.add("actif");
    }