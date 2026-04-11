const express = require("express")
const router = new express.Router()
const favCont = require("../controllers/favController")
const utilities = require("../utilities/")

// Apenas utilizadores logados podem ver/adicionar favoritos
router.get("/", utilities.checkJWTToken, utilities.handleErrors(favCont.buildFavoritesView))
router.post("/add", utilities.checkJWTToken, utilities.handleErrors(favCont.addFavorite))

module.exports = router