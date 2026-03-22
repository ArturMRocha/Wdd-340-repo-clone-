const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 * ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* TAREFA 1: Build the HTML for the specific vehicle
* ************************************ */
Util.buildItemDetails = async function(vehicle) {
  let price = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(vehicle.inv_price);
  let miles = new Intl.NumberFormat('en-US').format(vehicle.inv_miles);

  // Adicionamos classes específicas para você estilizar no CSS
  let grid = `<div class="detail-container">`;
  grid += `<div class="detail-image"><img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}"></div>`;
  grid += `<div class="detail-info">`;
  grid += `<h2>${vehicle.inv_make} ${vehicle.inv_model} Details</h2>`;
  grid += `<p class="price"><strong>Price:</strong> ${price}</p>`;
  grid += `<p class="description"><strong>Description:</strong> ${vehicle.inv_description}</p>`;
  grid += `<p><strong>Color:</strong> ${vehicle.inv_color}</p>`;
  grid += `<p><strong>Miles:</strong> ${miles}</p>`;
  grid += `</div></div>`;
  
  return grid;
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data && data.length > 0){ // Adicionada proteção extra
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      // MUDANÇA AQUI: Trocamos "../../" por "/" para o link nunca quebrar
      grid +=  '<a href="/inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + ' details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +'" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="/inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ****************************************
 * Middleware For Handling Errors
 * **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util