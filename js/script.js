/*fonction qui va creer l'affichage des articles produits 
dans l'index avec les données de l'API*/
function affichageProduit(article, div) {
  // creation des elements html dans le DOM

  let lienProduit = document.createElement("a");
  div.appendChild(lienProduit);
  lienProduit.href = "./product.html?id=" + article._id;

  let articleProduit = document.createElement("article");
  lienProduit.appendChild(articleProduit);

  let imageProduit = document.createElement("img");
  imageProduit.src = article.imageUrl;
  imageProduit.alt = article.altTxt;
  articleProduit.appendChild(imageProduit);

  let elemtTitre = document.createElement("h3");
  let contenuDuTitre = document.createTextNode(article.name);
  elemtTitre.appendChild(contenuDuTitre);
  articleProduit.appendChild(elemtTitre);

  let descriptionProduit = document.createElement("p");
  descriptionProduit.classList.add("productDescription");
  articleProduit.appendChild(descriptionProduit);
  let contenuDescProduit = document.createTextNode(article.description);
  descriptionProduit.appendChild(contenuDescProduit);
}

//Requete envoyée au service web ou recupérer les données de l'Api
fetch("http://localhost:3000/api/products")
  .then(function (reponse) {
    //si (condition qui s'appelle "reponse" a le parametre ok)
    if (reponse.ok) {
      //retourne cette condition "reponse" sous forme de caractère Json
      return reponse.json();
    }
  })
  .then(function (listeProduits) {
    //variable qui va chercher l'element qui a pour Id items
    let sectionProduit = document.getElementById("items");
    //dans cet element on insere une boucle pour chaque indice article de la liste listeProduits
    for (let article of listeProduits) {
      affichageProduit(article, sectionProduit);
    }
  })
  .catch(function (erreur) {
    console.log(erreur);
    alert("Oops! Veuillez réessayer dans un instant");
  });
