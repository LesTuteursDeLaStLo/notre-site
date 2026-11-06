const supabaseClient = window.supabase.createClient(
  'https://apzwctvjunasumqbuyxi.supabase.co/', 
  'sb_publishable_f-YKK4tPJK77y0tVI67urw_2o0ojeWj'
);



async function chargerDonnees() {
try{
  console.log("run");
    // --- 1. Gestion des revendications ---
    const Livres = document.getElementById("catalogue");
    if (Livres) {
      const { data: catalogue, error: errorBook } = await supabaseClient.from('CATALOGUE').select('*');
      console.log("Données reçues de Supabase :", catalogue, "Erreur :", errorBook);
      if (!errorBook && catalogue) {
        Livres.innerHTML = "";
        catalogue.forEach((line) => {
          let element = document.createElement("li");
          element.textContent = line.Auteurs + "," + line.AnnéeEcriture + "," + line.Titre + "," + line.Collection +","+ line.AnnéePublication + "," + "Emprunté: " + line.Status + "," + "Exemplaire rare: "+ line.Rare;
          Livres.appendChild(element);
        });
      }}
    } catch (err) {
    console.error("Erreur de chargement :", err);
  }}




document.addEventListener("DOMContentLoaded", chargerDonnees);
