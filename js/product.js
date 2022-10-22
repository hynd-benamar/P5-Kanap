//--------------------------------------------------------------------------
// Récupération de l'id du produit via l' URL
//--------------------------------------------------------------------------
//la variable rechercheParametre récupère l'url de la page
let rechercheParametre = new URLSearchParams(document.location.search);
// la variable id  récupére la valeur du paramètre id
let idProduit = rechercheParametre.get("id");
//--------------------------------------------------------------------------
//Requete envoyée au service web ou recupérer les données de l'Api
//--------------------------------------------------------------------------
fetch("http://localhost:3000/api/products/" + idProduit)
  .then(function (response) {
    if (response.ok) {
      return response.json();
    }
  })
  .then(function (value) {
    //console.log(value);
    affichageDonnesProduit(value);
  })
  .catch(function (erreur) {
    console.log(erreur);
    alert("Oops il semble y avoir un problème veuiller réessayer plus tard");
  });
//-------------------------------------------------------------------------
//fonction pour l' affichage des données produits
//-------------------------------------------------------------------------
function affichageDonnesProduit(produit) {
  let titreDeLaPage = document.getElementsByTagName("title");
  titreDeLaPage[0].innerHTML = produit.name;
  //affichage du titre produit
  let titreH1 = document.getElementById("title");
  titreH1.innerHTML = produit.name;
  //affichage de l'image produit
  let imageProduit = document.createElement("img");
  imageProduit.src = produit.imageUrl;
  imageProduit.alt = produit.altTxt;
  let divImageProduit = document.getElementsByClassName("item__img");
  divImageProduit[0].appendChild(imageProduit);
  //affichage du prix des produits
  let prix = document.getElementById("price");
  let contenuDuPrix = document.createTextNode(produit.price);
  prix.appendChild(contenuDuPrix);
  //affichage de la description des produits
  let pDescription = document.getElementById("description");
  let pDescriptionContenu = document.createTextNode(produit.description);
  pDescription.appendChild(pDescriptionContenu);
  //affichage du choix des couleur des produits
  let listeDeCouleur = document.getElementById("colors");
  for (let myColor of produit.colors) {
    let optionColor = document.createElement("option");
    optionColor.text = myColor;
    optionColor.value = myColor;
    listeDeCouleur.appendChild(optionColor);
  }
  //-------------------------------------------------------------------------
  //Gérer l'ajout de quantite de produit
  //-------------------------------------------------------------------------
  // On récupère l'élément sur lequel on veut détecter le clic
  let listeQuantite = document.getElementById("quantity");
  //on créer une variable que l'ont va définir grace à l'evenement suivant
  let quantiteProduit;
  // On écoute l'événement change sur l'objet  listeQuantite pour jouer l'action ajouteUnArticle
  listeQuantite.addEventListener("change", function (ajouteUnArticle) {
    // on récupère la valeur de la cible
    quantiteProduit = ajouteUnArticle.target.value;
    // on ajoute la quantité à l'objet panierClient
    idProduit.quantiteChoisie = quantiteProduit;
  });
  //-------------------------------------------------------------------------
  //Gérer l'ajout de produit au panier
  //-------------------------------------------------------------------------
  let choixDeProduit = document.getElementById("addToCart");
  // On écoute ce qu'il se passe sur le bouton #addToCart pour faire l'action :
  choixDeProduit.addEventListener("click", function () {
    //on recupere l'ID, la valeur de la couleur choisie, la valeur de la quantite dans l'API
    let couleurChoisie = listeDeCouleur.value;
    let quantiteChoisie = listeQuantite.value;
    let update = 0;
    if (
      typeof couleurChoisie == "undefined" ||
      couleurChoisie == 0 ||
      couleurChoisie == null ||
      quantiteChoisie == "undefined" ||
      quantiteChoisie == 0 ||
      quantiteChoisie == null
    ) {
      alert("veuillez choisir une couleur et une quantité supérieur à 0 !");
    } else {
      //Analyse une chaîne de caractères JSON et construit la valeur JavaScript décrit par cette chaîne
      let panierEnCours = JSON.parse(localStorage.getItem("monPanier"));
      if (panierEnCours) {
        console.log(panierEnCours);
        //boucle for sert de compteur pour le nombre de fois où la boucle sera executé.
        //Démarre à zéro car on n'a pas encore parcouru la boucle.
        for (let compteurProduit = 0; compteurProduit < panierEnCours.length; compteurProduit++) {
          if (panierEnCours[compteurProduit].idProduit == idProduit) {
            if (panierEnCours[compteurProduit].couleurChoisie == couleurChoisie) {
              panierEnCours[compteurProduit].quantiteChoisie =
                parseInt(panierEnCours[compteurProduit].quantiteChoisie) + parseInt(quantiteChoisie);
              update = 1;
            }
          }
        }
        if (update == 0) {
          //ajout dans le tableau de l'objet avec les values choisies par le user
          panierEnCours.push({ idProduit, couleurChoisie, quantiteChoisie });
          console.log("un produit différent a été ajouté au panier déjà existant");
        }
      } else {
        panierEnCours = [{ idProduit, couleurChoisie, quantiteChoisie }];
        console.log("un nouveau tableau a été crée");
      }
      //enregistrer le panier
      //convertit la valeur JavaScript en chaîne JSON
      //pour etre envoyé dans la key "monPanier" du localStorage
      localStorage.setItem("monPanier", JSON.stringify(panierEnCours));
    }
  });
}
