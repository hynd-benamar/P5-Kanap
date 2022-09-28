//--------------------------------------------------------------------------
//la variable qui va récupèrer l'id de la commande
//--------------------------------------------------------------------------
IdCommande = orderId;
//--------------------------------------------------------------------------
//variable qui va mettre l'id de la commande dans l'url de la page
//--------------------------------------------------------------------------
let rechercheParametre = new URLSearchParams(document.location.search);

//--------------------------------------------------------------------------
//Requete envoyée au service web pour recupérer l'ID de la commande
//--------------------------------------------------------------------------
//on appelle l'API
fetch("http://localhost:3000/api/order/")
  //si dans l'api il y a un orderId prend le
  .then(function (response) {
    if (response.ok) {
      return response.json();
    }
  })
  //sinon
  //affiche ce texte
  .catch(function (err) {
    console.log(err);
    // Une erreur est survenue
  });
console.log(orderId, "orderId");
//aucune commande
//--------------------------------------------------------------------------
//variable qui va mettre l'id de la commande dans le span du paragraphe
//--------------------------------------------------------------------------
//let spanOrderId = document.getElementById(orderId);
//spanOrderId.innerHTML = IdCommande;
