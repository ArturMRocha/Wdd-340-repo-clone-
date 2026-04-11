const favModel = require("../models/favorite-model")
const utilities = require("../utilities/")

const favCont = {}

/* ****************************************
* Exibir a página de Favoritos do Utilizador
* ************************************ */
favCont.buildFavoritesView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const account_id = res.locals.accountData.account_id
  const favorites = await favModel.getFavoritesByAccountId(account_id)
  
  res.render("favorites/index", {
    title: "My Wishlist",
    nav,
    errors: null,
    favorites,
  })
}

/* ****************************************
* Processar adição aos favoritos
* ************************************ */
favCont.addFavorite = async function (req, res) {
  const { inv_id } = req.body
  const account_id = res.locals.accountData.account_id
  
  const result = await favModel.addFavorite(account_id, inv_id)

  if (result) {
    req.flash("notice", "Vehicle added to your wishlist!")
    res.redirect("/fav/")
  } else {
    req.flash("notice", "Sorry, could not add to wishlist.")
    res.redirect("/inv/detail/" + inv_id)
  }
}

module.exports = favCont