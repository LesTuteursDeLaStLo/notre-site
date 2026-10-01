
const supabaseClient = window.supabase.createClient(
  'https://apzwctvjunasumqbuyxi.supabase.co/', 
  'sb_publishable_f-YKK4tPJK77y0tVI67urw_2o0ojeWj'
);



async function LoadImages() {
  try {
    // --- 1. Gestion des revendications ---
    const listeImages = document.getElementById("images");
    if (images) {
      const { data: images, error: errorImage } = await supabaseClient.from('images').select('*');
      if (!errorRev && images) {
        listeImages.innerHTML = "";
        images.forEach((line) => {
          let element = document.createElement("img");
          element.src = line.image_url;
          listeImages.appendChild(element);
        });
      }
    }

  

// Fonction d'envoi de commentaire
async function submitImage() {
  const url = document.getElementById("url");


  if (!url || commentaire.value.trim() === "") return;

  const { error: errorPosting } = await supabaseClient
    .from('images')
    .insert([{ image_url: url.value }]);

  if (!errorPosting) {
    commentaire.value = "";
    loadImages();
  }
}

// Lancement au chargement propre du DOM
document.addEventListener("DOMContentLoaded", () => {
  loadImages();
  const bouton = document.getElementById("send");
  if (bouton) {
    bouton.addEventListener("click", submitImage);
    
     const iframeParente = window.parent.document.getElementById("images");
    
   
      // On lui transmet la hauteur exacte du contenu bien réel et chargé
      iframeParente.style.height = document.documentElement.scrollHeight + 'px';
  }
});


//NON DISPONIBLE: Suppression d'un commentaire
function DeleteComment(){



}
