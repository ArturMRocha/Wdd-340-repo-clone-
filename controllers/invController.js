const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 * TAREFA 1: Build inventory item detail view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId // Pega o ID que vem da URL
  const data = await invModel.getInventoryById(inv_id)
  const grid = await utilities.buildItemDetails(data)
  let nav = await utilities.getNav()
  
  // O título da página será "Marca Modelo" (ex: Chevy Camaro)
  const vehicleName = `${data.inv_make} ${data.inv_model}`
  
  res.render("./inventory/detail", {
    title: vehicleName,
    nav,
    grid,
  })
}
/* ***************************
 * Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

// Esta função vai forçar um erro 500 para a Tarefa 3
invCont.triggerError = async function (req, res, next) {
  throw new Error("Oh no! This is a deliberate 500 error for Task 3.")
}
module.exports = invCont