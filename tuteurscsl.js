/*async function revendications() {
  try {
    // 1. Récupérer le fichier via son URL ou son chemin relatif
    const reponse = await fetch('revendications.txt');
    
    // 2. Extraire le texte brut
    const texte_brut= await reponse.text();
    
    // 3. Manipuler le texte (Exemple : remplacer un mot)
   // const texteModifie = texteOriginal.replace('ancien mot', 'nouveau mot');
   // console.log(texteModifie);

	const revendicationsList = texte_brut.split("\n"); 
	const liste = document.getElementById("revendications");
	
	for (let i=0;i<revendicationsList.length; i++){
		let section = document.createElement("section");
		section.id = "revendication" + (i+1);
		section.innerHTML=revendicationsList[i];
		liste.appendChild(section);
		}
    
   // return texteModifie;
  } catch (erreur) {
    console.error("Impossible de lire le fichier :", erreur);
  }
}
revendications()
*/
/*import {createClient} from "@supabase/supabase-js";
const URL = "https://apzwctvjunasumqbuyxi.supabase.co";
const API = "sb_publishable_f-YKK4tPJK77y0tVI67urw_2o0ojeWj";
const supabase = createClient(URL,API);

//Affichage des revendications
const listeRevendications = document.getElementById("revendications");
//const filtreAntiFacho = await supabase.from('banned words').select('*');
const {data: Revendications, error: errorRevendications} = await supabase.from('Revendications').select('*');
Revendications.forEach((line)=> {
  let element=document.createElement("li");
  element.textContent = line.contenu;
  listeRevendications.appendChild(element);
});

//Affichage des commentaires
//function errorCommentaires(){return;}
const listeCommentaires = document.getElementById("commentaires");
const {data: Commentaires, error: errorCommentaires} = await supabase.from('Commentaires').select('*');
Commentaires.forEach((line)=> {
  let section=document.createElement("section");
  let personne = document.createElement("table");
  const tbody= document.createElement("tbody");
  const tr=document.createElement("tr");
  const label = document.createElement("td");
  label.innerHTML = `Pseudonyme: <br>Faculté: `;
  tr.appendChild(label);
  const id = document.createElement("td");
  id.innerHTML = `${line.pseudonyme}<br>${line.faculte}`;
  tr.appendChild(id);
  tbody.appendChild(tr);
  personne.appendChild(tbody);
  let commentaire = document.createElement("p");
  commentaire.className="comments";
  commentaire.textContent=line.commentaire;
  section.appendChild(personne);
  section.appendChild(commentaire);
  listeCommentaires.appendChild(section);
});

//Publication de commentaire
async function PostComment(){

const pseudonyme = document.getElementById("pseudo");
const faculte = document.getElementById("faculte");
const commentaire = document.getElementById("contenuCommentaire");

const pseudo = pseudonyme.value.trim()==="" ? "Anonyme" : pseudonyme.value;
const fac = faculte.value.trim()==="" ? "Anonyme" : faculte.value;

if (commentaire.value.trim()===""){ return; }

const{data: Commentaires,error: errorPosting} = await supabase.from('Commentaires').insert([{pseudonyme:pseudo,faculte:fac, commentaire:commentaire.value}]);


}

const bouton = document.getElementById("btn-publier");
if (bouton) {
  bouton.addEventListener("click", PostComment);
}
*/
// On récupère Supabase depuis l'objet global du navigateur
const { createClient } = window.supabase;

const URL = "https://supabase.co";
const API = "sb_publishable_f-YKK4tPJK77y0tVI67urw_2o0ojeWj";
const supabaseClient = createClient(URL, API);

// Fonction isolée pour charger les données
async function chargerDonnees() {
  try {
    // --- 1. Affichage des revendications ---
    const listeRevendications = document.getElementById("revendications");
    if (listeRevendications) {
      const { data: Revendications, error: errorRev } = await supabaseClient.from('Revendications').select('*');
      if (errorRev) {
        console.error("Erreur Revendications :", errorRev.message);
      } else if (Revendications) {
        listeRevendications.innerHTML = "";
        Revendications.forEach((line) => {
          let element = document.createElement("li");
          element.textContent = line.contenu;
          listeRevendications.appendChild(element);
        });
      }
    }

    // --- 2. Affichage des commentaires ---
    const listeCommentaires = document.getElementById("commentaires");
    if (listeCommentaires) {
      const { data: Commentaires, error: errorComm } = await supabaseClient.from('Commentaires').select('*');
      if (errorComm) {
        console.error("Erreur Commentaires :", errorComm.message);
      } else if (Commentaires) {
        listeCommentaires.innerHTML = "";
        Commentaires.forEach((line) => {
          let section = document.createElement("section");
          let personne = document.createElement("table");
          const tbody = document.createElement("tbody");
          const tr = document.createElement("tr");
          const label = document.createElement("td");
          
          label.innerHTML = `Pseudonyme: <br>Faculté: `;
          tr.appendChild(label);
          
          const id = document.createElement("td");
          id.innerHTML = `${line.pseudonyme || 'Anonyme'}<br>${line.faculte || ''}`;
          tr.appendChild(id);
          
          tbody.appendChild(tr);
          personne.appendChild(tbody);
          
          let commentaire = document.createElement("p");
          commentaire.className = "comments";
          commentaire.textContent = line.commentaire;
          
          section.appendChild(personne);
          section.appendChild(commentaire);
          listeCommentaires.appendChild(section);
        });
      }
    }
  } catch (err) {
    console.error("Erreur globale de chargement :", err);
  }
}

// --- 3. Publication de commentaire ---
async function PostComment() {
  const pseudonyme = document.getElementById("pseudo");
  const faculte = document.getElementById("faculte");
  const commentaire = document.getElementById("contenuCommentaire");

  if (!commentaire || commentaire.value.trim() === "") return;

  const pseudo = pseudonyme && pseudonyme.value.trim() !== "" ? pseudonyme.value : "Anonyme";
  const fac = faculte && faculte.value.trim() !== "" ? faculte.value : "Anonyme";

  const { error: errorPosting } = await supabaseClient
    .from('Commentaires')
    .insert([{ pseudonyme: pseudo, faculte: fac, commentaire: commentaire.value }]);

  if (errorPosting) {
    console.error("Erreur insertion :", errorPosting.message);
    alert("Impossible d'envoyer le commentaire.");
  } else {
    commentaire.value = "";
    chargerDonnees(); // Recharge la liste sans rafraîchir la page
  }
}

// --- 4. Initialisation des boutons au chargement complet ---
document.addEventListener("DOMContentLoaded", () => {
  chargerDonnees();

  const bouton = document.getElementById("btn-publier");
  if (bouton) {
    bouton.addEventListener("click", PostComment);
  }
});


//NON DISPONIBLE: Suppression d'un commentaire
function DeleteComment(){



}
