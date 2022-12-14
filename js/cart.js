//-------------------------------------------------------------------------------------
//                  fonction pour l' affichage des données produits
//-------------------------------------------------------------------------------------
function affichageProduitDansPanier(canape, cartDataOfProduct, sectionPanier) {
  // creation des elements html articles dans le DOM
  let articlePanier = document.createElement("article");
  sectionPanier.appendChild(articlePanier);
  articlePanier.dataset.id = cartDataOfProduct.idProduit;
  articlePanier.dataset.color = cartDataOfProduct.couleurChoisie;
  articlePanier.classList.add("cart__item");
  // creation de l'element html div dans le DOM
  let divImageProduitPanier = document.createElement("div");
  articlePanier.appendChild(divImageProduitPanier);
  divImageProduitPanier.classList.add("cart__item__img");
  // creation de l'element html image dans le DOM
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

  //-----------------------------------------------------------------------------------------
  //                  MAJ du panier lors du changement de la value de l'input qty
  //-----------------------------------------------------------------------------------------
  //au changement de la valeur de l'input quantite applique la fonction changementDeValeur
  inputQuantity.addEventListener("change", function () {
    //prend l'objet dans LS et ecrit lui la valeur affiché dans l'input
    quantiteChoisie = inputQuantity.value;
    updateQty(quantiteChoisie, cartDataOfProduct);
  });

  //--------------------------------------------------------------------------------------
  //                             creer la "div" bouton supprimer
  //--------------------------------------------------------------------------------------
  let divSuppressionArticlePanier = document.createElement("div");
  divSuppressionArticlePanier.classList.add("cart__item__content__settings__delete");
  divParametreContenuArticle.appendChild(divSuppressionArticlePanier);
  //------ajout du "p" de la "div" supprimer---------------------
  let pSuppressionArticlePanier = document.createElement("p");
  pSuppressionArticlePanier.classList.add("deleteItem");
  divSuppressionArticlePanier.appendChild(pSuppressionArticlePanier);
  let pContenuSuppressionArticlePanier = document.createTextNode("Supprimer");
  pSuppressionArticlePanier.appendChild(pContenuSuppressionArticlePanier);
  //--------------evenement au click qui supprimera l'arcticle du panier------------------
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
    let panierEnCours = JSON.parse(localStorage.getItem("monPanier"));
    if (typeof panierEnCours == "undefined" || panierEnCours == 0 || panierEnCours == null) {
      formulaire[0].setAttribute("style", "display:none");
    }
  });
}
function updateQty(qty, cartDataOfProduct) {
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
//-------------------------------------------------------------------------------------------
//           Requete envoyée au service web où recupérer les données de l'Api
//-------------------------------------------------------------------------------------------
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
//              fonction qui lit le panier dans le LocalStorage et l'affiche dans le DOM
//---------------------------------------------------------------------------------------------------------

LectureDuPanier();
function LectureDuPanier() {
  // si l'élément 'monPanier' est stocké dans le web storage
  //
  if (localStorage.getItem("monPanier") && JSON.parse(localStorage.getItem("monPanier")).length > 0) {
    //if (localStorage.getItem("monPanier") && localStorage.getItem("monPanier").length > 2) {
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
      console.log(article);
    }
    updateTotal();
  } else {
    //faire apparaitre un paragraphe html pour dire que le panier est vide
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
    /*let formulaire = document.getElementsByClassName("cart__order__form");
    formulaire.setAttribute("style", "display:none");*/
  }
}
//----------------------------------------------------------------------------------------------
//                           Calcule du prix total et de la quantité
//----------------------------------------------------------------------------------------------
//on déclare une fonction qui va être utiliser pour mettre à jour le prix total * la quantité à chaque modification
function updateTotal() {
  //declaration de la variable pour y mettre les prix qui sont dans le panier
  let tableauDeTousLesPrix = [];
  let panierEnCours = JSON.parse(localStorage.getItem("monPanier"));

  //si le panier est plus grand que 0 (s'il n'a pas 0 objet)
  if (panierEnCours.length > 0) {
    // lancer la boucle for
    //on utilise une boucle pour aller chercher les prix dans le panier
    for (let m = 0; m < panierEnCours.length; m++) {
      //---------------------requete Fetch pour récuperer le prix des articles-----------------------
      let promesseFetch = fetch("http://localhost:3000/api/products/" + panierEnCours[m].idProduit);
      //la promesse fetch renvoie une donnée que l'ont va utiliser grace à la methode .then
      //qui va renvoyer la donnée dans l'argument response qui va etre envoyer dans la console log
      promesseFetch
        .then(async (response) => {
          const kanap = await response.json();
          tableauDeTousLesPrix.push(kanap.price * parseInt(panierEnCours[m].quantiteChoisie));
          //on additionne les prix qui sont dans le tableau de la variable tableauDeTousLesPrix avec la méthode reduce()
          //Additionner toutes les valeurs d'un tableau
          //var total = [0, 1, 2, 3].reduce((a, b)=> a + b,0);
          // total == 6
          // 1 on declare une constante qui sera egal à 2 arguments additionnés et qui servira calculateur
          const reducteur = (accumulator, currentValue) => accumulator + currentValue;
          // 2 on declare une constante qui appliquera la methode reduce sur notre tableau des prix
          // et qui réalisera une reduction grace à un calcul
          //si on appelle reduce() sur un tableau vide sans fournir de valeur initiale, on aura une erreur
          const TotalDesPrix = tableauDeTousLesPrix.reduce(reducteur, 0);
          //faire apparaitre le total dans prixTotal dans le panier
          let spanTotalPrice = document.getElementById("totalPrice");
          spanTotalPrice.textContent = TotalDesPrix;
          //----------------------------------------------------------------------------------------------
          //declaration de la variable pour y mettre les quantites qui sont dans le panier
          let tableauDeToutesLesQuantites = [];
          //on utilise une boucle pour aller chercher les quantites dans le panier
          for (let m = 0; m < panierEnCours.length; m++) {
            //On déclare à nouveau une variable qui est égale à tout le contenu de ma key monPanier sous forme de array
            let allValueMonpanier = JSON.parse(localStorage.getItem("monPanier"));
            //variable qui recupere les quantites dans le localStorage
            let quantiteProduitDansLS = parseInt(allValueMonpanier[m].quantiteChoisie);
            //on met les quantite du panier ds la variable tableauDeToutesLesQuantites pour les pousser dans son tableau
            tableauDeToutesLesQuantites.push(quantiteProduitDansLS);
          }
          const TotalDesQuantites = tableauDeToutesLesQuantites.reduce(reducteur, 0);
          console.log(TotalDesQuantites);
          let spanTotalQty = document.getElementById("totalQuantity");
          spanTotalQty.textContent = TotalDesQuantites;
        })
        .catch((erreur) => console.log(erreur));
      //------------------------------------fin de la methode fetch-------------------------------------------
    }
    // Si non, mettre à jour QTY ET TOTAL à 0
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

//--------------------------------------------------------------------------------------------------------
//                                           PARTIE FORMULAIRE
//--------------------------------------------------------------------------------------------------------
// Sélection du Formulaire dans le DOM
const formulaire = document.getElementsByClassName("cart__order__form");
let panierEnCours = JSON.parse(localStorage.getItem("monPanier"));
if (typeof panierEnCours == "undefined" || panierEnCours == 0 || panierEnCours == null) {
  formulaire[0].setAttribute("style", "display:none");
} else {
  //******Creer un addEventListener sur le submit du btn Commander pr enregistrer ds LS les value*****
  formulaire[0].addEventListener("submit", async (e) => {
    e.preventDefault();
    //let panierEnCours = JSON.parse(localStorage.getItem("monPanier"));
    let products = [];
    for (let index in panierEnCours) {
      products.push(panierEnCours[index]["idProduit"]);
    }

    //**********3 verifier la validité des données du formulaire avant l'envoie dans le localStorage*
    //regex pour le prenom, le nom et la ville
    const regExPrenomNomVille = (valeur) => {
      return /^[A-Za-z(çàâéèêëîïôöù)'-\s]{2,20}$/.test(valeur);
    };
    //adresse
    const regExAdresse = (valeur) => {
      return /^[A-Za-z0-9(çàâéèêëîïôöù)'-\s]{3,}$/.test(valeur);
    };
    //email
    const regExEmail = (valeur) => {
      return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(valeur);
    };
    function controlePrenom() {
      let prenom = document.getElementById("firstName").value;
      if (regExPrenomNomVille(prenom)) {
        return true;
      } else {
        document.getElementById("firstNameErrorMsg").textContent = "Le prénom est mal saisi !";
        return false;
      }
    }
    function controleNom() {
      let nom = document.getElementById("lastName").value;
      if (regExPrenomNomVille(nom)) {
        return true;
      } else {
        document.getElementById("lastNameErrorMsg").textContent = "Le nom est mal saisi !";
        return false;
      }
    }
    function controleVille() {
      let ville = document.getElementById("city").value;
      if (regExPrenomNomVille(ville)) {
        return true;
      } else {
        document.getElementById("cityErrorMsg").textContent = "La ville est mal saisie !";
        return false;
      }
    }
    function controleAdresse() {
      let adresse = document.getElementById("address").value;
      if (regExAdresse(adresse)) {
        return true;
      } else {
        document.getElementById("addressErrorMsg").textContent = "L'adresse est mal saisie !";
        return false;
      }
    }
    function controleEmail() {
      let email = document.getElementById("email").value;
      if (regExEmail(email)) {
        return true;
      } else {
        document.getElementById("emailErrorMsg").textContent = "Votre email est mal saisi !";
        return false;
      }
    }
    //**********5 conditions qui determine l'envoie de l'objet formulaireValues dans l'api'***
    if (controlePrenom() && controleNom() && controleVille() && controleAdresse() && controleEmail()) {
      //objet qui contient les infos du formulaire et le contenu du panier
      let contact = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        email: document.getElementById("email").value,
      };
      console.log(JSON.stringify({ contact, products }));
      fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        body: JSON.stringify({ contact, products }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        // Récupération et stockage de la réponse de l'API (orderId)
        .then((response) => {
          return response.json();
        })
        .then((server) => {
          orderId = server.orderId;
          console.log(orderId);
          // Si l'orderId a bien été récupéré, on redirige l'utilisateur vers la page de Confirmation
          if (orderId != "") {
            location.href = "confirmation.html?id=" + orderId;
          }
        });
    }
  });
}
