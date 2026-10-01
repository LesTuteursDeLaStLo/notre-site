

const supabaseClient = window.supabase.createClient(
  'https://supabase.co', 
  'sb_publishable_f-YKK4tPJK77y0tVI67urw_2o0ojeWj'
);

async function loadImages() {
  try {
    const listeImages = document.getElementById("images");
    if (listeImages) {
      const { data: images, error: errorImage } = await supabaseClient.from('images').select('*');
      if (!errorImage && images) {
        listeImages.innerHTML = "";
        images.forEach((line) => {
          let element = document.createElement("img");
          element.src = line.image_url;
          listeImages.appendChild(element);
        });
      }
    } // Une seule accolade ici pour fermer le "if (listeImages)"
  } catch (err) { // L'accolade juste avant le catch ferme correctement le "try"
    console.error("Erreur lors du chargement :", err);
  }
} // Cette accolade ferme la fonction loadImages


  

// Fonction d'envoi de commentaire
async function submitImage() {
  const url = document.getElementById("url");


  if (!url || url.value.trim() === "") return;

  const { error: errorPosting } = await supabaseClient
    .from('images')
    .insert([{ image_url: url.value }]);

  if (!errorPosting) {
    url.value = "";
    loadImages();
  }
}

// Lancement au chargement propre du DOM
document.addEventListener("DOMContentLoaded", () => {
  loadImages();
  const bouton = document.getElementById("send");
  if (bouton) {
    bouton.addEventListener("click", submitImage);
    
   //  const iframeParente = window.parent.document.getElementById("images");
    
   
      // On lui transmet la hauteur exacte du contenu bien réel et chargé
    //  iframeParente.style.height = document.documentElement.scrollHeight + 'px';
  }
});


//NON DISPONIBLE: Suppression d'un commentaire
function DeleteComment(){



}
