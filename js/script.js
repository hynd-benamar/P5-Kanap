/*fonction qui va creer l'affichage des articles produits 
dans l'index avec les données de l'API*/
function affichageProduit(index) {
  //variable qui va chercher l'element qui a pour Id items
  let sectionProduit = document.getElementById("items");
  //dans cet element on insere une boucle pour chaque indice article de l'index
  for (let article of index) {
    // creation des elements html dans le DOM

    let lienProduit = document.createElement("a");
    sectionProduit.appendChild(lienProduit);
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
}

//Requete envoyée au service web ou recupérer les données de l'Api
fetch("http://localhost:3000/api/products")
  .then(function (reponse) {
    //si tu as une reponse
    if (reponse.ok) {
      //renvoir la reponse en Json
      return reponse.json();
    }
  })
  .then(function (value) {
    //console.log(value);
    affichageProduit(value);
  })
  .catch(function (err) {
    // Une erreur est survenue
  });
