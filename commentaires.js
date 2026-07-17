// 1. Connexion à votre base de données Supabase
// (Remplacez avec vos vraies clés fournies par Supabase)
const SUPABASE_URL = "https://apzwctvjunasumqbuyxi.supabase.co";
const SUPABASE_KEY = "sb_publishable_f-YKK4tPJK77y0tVI67urw_2o0ojeWj";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. Fonction pour ENVOYER un commentaire (déclenchée par le bouton)
async function publication() {
    const pseudoSaisi = document.getElementById("pseudo").value;
    const faculteSaisi = document.getElementById("faculte").value;
    const texteSaisi = document.getElementById("commentaire-texte").value;

    if (pseudoSaisi.trim() === "" || texteSaisi.trim() === "") {
        alert("Veuillez remplir le pseudonyme et le message !");
        return;
    }
    if (faculteSaisi.trim() ===""){faculte="Anonyme";}
    // Envoi des données dans la table de Supabase
    const { data, error } = await supabase
        .from('commentaires')
        .insert([{ pseudo: pseudoSaisi, faculte:faculteSaisi, texte: texteSaisi }]);

    if (error) {
        console.error("Erreur d'envoi :", error);
        alert("Impossible d'envoyer le commentaire.");
    } else {
        // Effacer les champs du formulaire après envoi
        document.getElementById("pseudo").value = "";
        document.getElementById("faculte").value="";
        document.getElementById("commentaire-texte").value = "";
        // Recharger la liste pour afficher le nouveau commentaire
        chargerCommentaires();
    }
}

// 3. Fonction pour LIRE et AFFICHER les commentaires de tout le monde
async function chargerCommentaires() {
    const { data: listeCommentaires, error } = await supabase
        .from('commentaires')
        .select('*')
        .order('created_at', { ascending: false }); // Du plus récent au plus ancien

    if (error) {
        console.error("Erreur de chargement :", error);
        return;
    }

    // On cherche l'endroit où afficher les commentaires dans le HTML
    const zoneForum = document.getElementById("commentaires");
    
    // On supprime les anciens commentaires affichés pour ne pas faire de doublons
    const anciensEtiquettes = zoneForum.querySelectorAll(".un-commentaire");
    anciensEtiquettes.forEach(el => el.remove());

    // On crée les balises HTML pour chaque commentaire trouvé dans la base de données
    listeCommentaires.forEach(comment => {
        const section = document.createElement("section");
        section.className = "un-commentaire";
       // section.style.borderBottom = "1px solid #ccc";
       // section.style.margin = "10px 0";
       // section.style.padding = "5px";
        
        section.innerHTML = `<strong>${comment.pseudo}</strong> : <p>${comment.texte}</p>`;
        zoneForum.appendChild(section);
    });
}

// Charger automatiquement les commentaires dès que la page s'ouvre
chargerCommentaires();
