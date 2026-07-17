import re
import unicodedata

def nettoyer_texte(texte):
    """Nettoie le texte pour éviter les contournements faciles (accents, leet speak)."""
    # Force le passage en minuscules
    texte = texte.lower()
    
    # Remplace les variantes courantes de "leet speak"
    remplacements = {'0': 'o', '3': 'e', '1': 'i', '4': 'a', '5': 's', '7': 't', 'ø': 'o'}
    for lettre, remplacement in remplacements.items():
        texte = texte.replace(lettre, remplacement)
        
    # Supprime les accents (ex: é, è, à deviennent e, e, a)
    texte = ''.join(c for c in unicodedata.normalize('NFD', texte) if unicodedata.category(c) != 'Mn')
    return texte

def charger_mots_interdits(fichier_chemin="bannedwords.txt"):
    """Charge les mots du fichier, ignore les doublons et les lignes vides."""
    mots = set()
    try:
        with open(fichier_chemin, "r", encoding="utf-8") as f:
            for ligne in f:
                mot = ligne.strip().lower()
                if mot:
                    mots.add(mot)
    except FileNotFoundError:
        print(f"Erreur : Le fichier {fichier_chemin} n'a pas été trouvé.")
    return list(mots)

def verifier_commentaire(commentaire, mots_interdits):
    """Vérifie si le commentaire contient des mots interdits par la loi."""
    texte_propre = nettoyer_texte(commentaire)
    
    mots_detectes = []
    for mot in mots_interdits:
        # \b garantit que le mot est isolé (évite de bloquer "connaître" pour "con")
        pattern = rf"\b{re.escape(mot)}\b"
        if re.search(pattern, texte_propre):
            mots_detectes.append(mot)
            
    if mots_detectes:
        return False, f"Refusé (Contient des termes interdits : {', '.join(mots_detectes)})"
    return True, "Commentaire validé"

# --- TEST DU SYSTÈME ---
# Exemple de liste chargée (simulant votre fichier)
index_mots = ["nigger", "porn", "sex", "tuer", "suicide"]

# Tests avec différents scénarios
commentaires_test = [
    "C'est un sex-shop ?", # Devrait bloquer "sex"
    "Je vais te tuer demain", # Devrait bloquer "tuer"
    "Il faut connaître ses classiques", # Devrait PAS bloquer "con" (grâce à \b)
    "Regarder du p0rn c'est mal", # Devrait bloquer (grâce au nettoyage du '0')
]

for com in commentaires_test:
    valide, message = verifier_commentaire(com, index_mots)
    print(f"Commentaire : '{com}' -> {message}")







# Supprime tous les espaces, points, tirets et caractères spéciaux collés au mot
texte = re.sub(r'[^a-zA-Z0-9]', '', texte)




@app.route('/ajouter-commentaire', methods=['POST'])
def ajouter_commentaire():
    donnees = request.get_json()
    contenu_commentaire = donnees.get('texte', '')
    
    # Validation via le filtre
    est_valide, _ = verifier_commentaire(contenu_commentaire, LISTE_NOIRE)
    
    if not est_valide:
        # Blocage strict avec le message pédagogique complet
        return jsonify({
            "statut": "refuse",
            "titre": "⚠️ Message non publié",
            "message": "Votre commentaire contient des termes ou des expressions interdits par la loi "
                       "(incitation à la haine, propos racistes, injures ou menaces). Notre espace anonyme "
                       "garantit la liberté d'expression, mais impose le respect strict de la législation. "
                       "Merci de reformuler votre message de manière respectueuse."
        }), 400

    # Si tout est OK, enregistrement anonyme dans la base de données...
    return jsonify({"statut": "succes", "message": "Commentaire publié !"}), 201




###### MOT DE PASSE
from flask import Flask, render_template, request, redirect, url_for, session, flash
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
# Une clé secrète forte est obligatoire pour sécuriser les sessions de connexion
app.secret_key = "remplacez_ceci_par_une_longue_chaine_aleatoire_et_secrete"

# Simulation de votre modérateur dans la base de données.
# Ce hash correspond au mot de passe "AdminSecurise2026" généré proprement.
COMPTE_MODERATEUR = {
    "identifiant": "admin",
    "mot_de_passe_hache": generate_password_hash("AdminSecurise2026")
}

@app.route('/moderation/connexion', methods=['GET', 'POST'])
def login_moderateur():
    if request.method == 'POST':
        user_saisi = request.form.get('username', '').strip()
        mdp_saisi = request.form.get('password', '').strip()
        
        # 1. Vérification sécurisée (on évite les fuites d'indices)
        if user_saisi == COMPTE_MODERATEUR["identifiant"] and \
           check_password_hash(COMPTE_MODERATEUR["mot_de_passe_hache"], mdp_saisi):
            
            # 2. Le mot de passe est bon, on ouvre la session
            session['est_modateur'] = True
            session['nom_mod'] = user_saisi
            return redirect(url_for('page_tableau_bord'))
        
        else:
            # Erreur générique volontaire pour tromper les curieux
            flash("Identifiant ou mot de passe incorrect.", "erreur")
            
    return render_template('moderation/connexion.html')


@app.route('/moderation/dashboard')
def page_tableau_bord():
    # 3. VERROU SÉCURITÉ : On vérifie à CHAQUE chargement si la session est active
    if not session.get('est_modateur'):
        # Si non connecté, redirection immédiate vers le login
        flash("Accès interdit. Veuillez vous connecter.", "erreur")
        return redirect(url_for('login_moderateur'))
        
    return render_template('moderation/dashboard.html')


@app.route('/moderation/deconnexion')
def deconnexion():
    # Déconnecte proprement le modérateur en vidant la session
    session.clear()
    return redirect(url_for('login_moderateur'))
