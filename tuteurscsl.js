async function revendications() {
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
