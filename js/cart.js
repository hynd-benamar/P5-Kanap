//-------------------------------------------------------------------------
//fonction pour l' affichage des données produits
//-------------------------------------------------------------------------
function affichageProduitDansPanier(canape, cartDataOfProduct, sectionPanier) {
  // creation des elements html dans le DOM
  let articlePanier = document.createElement("article");
  sectionPanier.appendChild(articlePanier);
  articlePanier.dataset.id = cartDataOfProduct.idProduit;
  articlePanier.dataset.color = cartDataOfProduct.couleurChoisie;
  articlePanier.classList.add("cart__item");

  let divImageProduitPanier = document.createElement("div");
  articlePanier.appendChild(divImageProduitPanier);
  divImageProduitPanier.classList.add("cart__item__img");

  let imageProduit = document.createElement("img");
  divImageProduitPanier.appendChild(imageProduit);
  imageProduit.src = canape.imageUrl;
  imageProduit.alt = canape.altTxt;

  let divDonnesProduit = document.createElement("div");
  articlePanier.appendChild(divDonnesProduit);
  divDonnesProduit.classList.add("cart__item__content");

  let divDescriptionProduit = document.createElement("div");
  divDonnesProduit.appendChild(divDescriptionProduit);
  divDescriptionProduit.classList.add("cart__item__content__description");

  let elemtTitre = document.createElement("h2");
  let contenuDuTitre = document.createTextNode(canape.name);
  elemtTitre.appendChild(contenuDuTitre);
  divDescriptionProduit.appendChild(elemtTitre);

  let couleurChoisie = document.createElement("p");
  divDescriptionProduit.appendChild(couleurChoisie);
  let contenuCouleur = document.createTextNode(cartDataOfProduct.couleurChoisie);
  couleurChoisie.appendChild(contenuCouleur);

  let prixProduitUnitaire = document.createElement("p");
  divDescriptionProduit.appendChild(prixProduitUnitaire);
  let contenuPrixProduitUnitaire = document.createTextNode(canape.price + " €");
  prixProduitUnitaire.appendChild(contenuPrixProduitUnitaire);

  let divParametreContenuArticle = document.createElement("div");
  divDonnesProduit.appendChild(divParametreContenuArticle);
  divParametreContenuArticle.classList.add("cart__item__content__settings");

  let divParametreQtiteArticle = document.createElement("div");
  divParametreContenuArticle.appendChild(divParametreQtiteArticle);
  divParametreQtiteArticle.classList.add("cart__item__content__settings__quantity");

  //<p>Qté
  let pQuantite = document.createElement("p");
  divParametreQtiteArticle.appendChild(pQuantite);
  let pQuantiteContenu = document.createTextNode("Qté : ");
  pQuantite.appendChild(pQuantiteContenu);

  //input number de Qté
  let inputQuantity = document.createElement("input");
  divParametreQtiteArticle.appendChild(inputQuantity);
  inputQuantity.classList.add("itemQuantity");
  inputQuantity.setAttribute("type", "number");
  inputQuantity.setAttribute("name", "itemQuantity"); // Change le nom de l'input en itemQuantity
  inputQuantity.setAttribute("value", cartDataOfProduct.quantiteChoisie);
  inputQuantity.setAttribute("min", "1");
  inputQuantity.setAttribute("max", "100");
  //---------------MAJ du panier lors du changement de la value de l'input qty--------------------
  //au changement de la valeur de l'input quantite applique la fonction changementDeValeur
  inputQuantity.addEventListener("change", function () {
    //prend l'objet dans LS et ecrit lui la valeur affiché dans l'input
    quantiteChoisie = inputQuantity.value;
    updateQty(quantiteChoisie);
  });

  //--------------------------------------------------------------------------------------
  //creer la "div" supprimer--
  let divSuppressionArticlePanier = document.createElement("div");
  divSuppressionArticlePanier.classList.add("cart__item__content__settings__delete");
  divParametreContenuArticle.appendChild(divSuppressionArticlePanier);
  //ajout du "p" de la "div" supprimer
  let pSuppressionArticlePanier = document.createElement("p");
  pSuppressionArticlePanier.classList.add("deleteItem");
  divSuppressionArticlePanier.appendChild(pSuppressionArticlePanier);
  let pContenuSuppressionArticlePanier = document.createTextNode("Supprimer");
  pSuppressionArticlePanier.appendChild(pContenuSuppressionArticlePanier);
  //-----evenement au click qui supprimera l'arcticle du panier----
  pSuppressionArticlePanier.addEventListener("click", (e) => {
    e.preventDefault;
    console.log("clique!");
    //au click prend l'id et la couleur du produit selectionné grace à la méthode closest()
    //let idSupprimer = pSuppressionArticlePanier.closest("[data-id]");
    //let couleurSupprimer = pSuppressionArticlePanier.closest(couleurChoisie);
    let panierDuLocalStorage = JSON.parse(localStorage.getItem("monPanier"));
    //on utilise la methode filter inversé pour ne garder que les couleurs et id qui ne sont pas selectionnés
    panierDuLocalStorage = panierDuLocalStorage.filter(
      (truc) =>
        truc.idProduit !== cartDataOfProduct.idProduit || truc.couleurChoisie !== cartDataOfProduct.couleurChoisie
    );

    console.log(panierDuLocalStorage);
    // envoyer le nouveau contenu du panier au lS
    localStorage.setItem("monPanier", JSON.stringify(panierDuLocalStorage));
    articlePanier.remove();
    updateTotal();
  });
}
function updateQty(qty) {
  console.log(qty);
  let panierEnCours = JSON.parse(localStorage.getItem("monPanier"));
  for (let compteurProduit = 0; compteurProduit < panierEnCours.length; compteurProduit++) {
    if (panierEnCours[compteurProduit].idProduit == cartDataOfProduct.idProduit) {
      if (panierEnCours[compteurProduit].couleurChoisie == cartDataOfProduct.couleurChoisie) {
        panierEnCours[compteurProduit].quantiteChoisie = parseInt(qty);
      }
    }
  }
  localStorage.setItem("monPanier", JSON.stringify(panierEnCours));
  updateTotal();
}
//--------------------------------------------------------------------------
//Requete envoyée au service web où recupérer les données de l'Api
//--------------------------------------------------------------------------
function getProduct(product, sectionPanier) {
  console.log(product);
  fetch("http://localhost:3000/api/products/" + product.idProduit)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
    })
    .then(function (value) {
      console.log(value);
      affichageProduitDansPanier(value, product, sectionPanier);
    })
    .catch(function (err) {
      console.log(err);
      // Une erreur est survenue
    });
}
//---------------------------------------------------------------------------------------------------------
//
//---------------------------------------------------------------------------------------------------------
LectureDuPanier();
function LectureDuPanier() {
  // si l'élément 'monPanier' est stocké dans le web storage
  if (localStorage.getItem("monPanier")) {
    console.log("le panier a trouver un objet dans le localStorage");
    /*Declare la variable "panierDuLocalStorage" dans laquelle on met les key et les value qui sont dans le LS
    la variable panierDuLocalStorage = JSON.parse -> convertis l'objet JSON suivant en JS 
    localStorage.getItem -> va dans localstorage et lis l'item ("mon panier"))*/
    let panierDuLocalStorage = JSON.parse(localStorage.getItem("monPanier"));
    console.log("le panier accéde au localStorage");
    let sectionPanier = document.getElementById("cart__items");
    //dans cet element on insere une boucle pour chaque indice article dans le panier
    for (let article of panierDuLocalStorage) {
      getProduct(article, sectionPanier);
      console.log("produits ajoutés!");
    }
  } else {
    //faire apparaitre un paragrphe html pour dire que le panier est vide
    let paragrapheVide = document.createElement("p");
    paragrapheVide.textContent = "Votre panier est vide.";
    let sectionPanier = document.getElementById("cart__items");
    sectionPanier.appendChild(paragrapheVide);
    console.log("votre panier est vide");
    //faire apparaitre le nombre 0 dans totalqty et prixTotal dans le panier
    let spanTotalQty = document.getElementById("totalQuantity");
    spanTotalQty.textContent = "0";
    let spanTotalPrice = document.getElementById("totalPrice");
    spanTotalPrice.textContent = "0";
  }
}
//----------------------------------------------------------------------------------------------
