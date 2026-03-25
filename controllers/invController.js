const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 * TAREFA 1: Build inventory item detail view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getInventoryById(inv_id)
  
  // Proteção: Se o ID não existir no banco
  if (!data) {
    return next({status: 404, message: 'Vehicle not found.'})
  }

  const grid = await utilities.buildItemDetails(data)
  let nav = await utilities.getNav()
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
  
  // --- CORREÇÃO AQUI ---
  // Se 'data' estiver vazio, data[0] quebra o site. 
  // Usamos uma verificação simples:
  let className = "Vehicle"
  if (data && data.length > 0) {
    className = data[0].classification_name
  } else {
    // Opcional: buscar o nome da categoria no model se o array de carros estiver vazio
    className = "Empty Category" 
  }

  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 * TAREFA 3: Forçar erro 500
 * ************************** */
invCont.triggerError = function (req, res, next) {
  throw new Error("Oh no! This is a deliberate 500 error for Task 3.")
}

module.exports = invCont