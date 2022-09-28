//--------------------------------------------------------------------------
//variable qui va mettre l'id de la commande dans l'url de la page
//--------------------------------------------------------------------------
let rechercheParametre = new URLSearchParams(document.location.search);
//--------------------------------------------------------------------------
//la variable qui va récupèrer l'id de la commande
//--------------------------------------------------------------------------
getProductId = () => {
  return new URL(location.href).searchParams.get("id");
};
const orderId = getProductId();
console.log(orderId);
//--------------------------------------------------------------------------
//variable qui va mettre l'id de la commande dans le span du paragraphe
//--------------------------------------------------------------------------
let spanOrderId = document.getElementById("orderId");
spanOrderId.innerHTML = orderId;
//vider le localStorage
localStorage.clear();
