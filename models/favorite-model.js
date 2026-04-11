const pool = require("../database/")

/* *****************************
* Adicionar um veículo aos favoritos
* *************************** */
async function addFavorite(account_id, inv_id) {
  try {
    const sql = "INSERT INTO favorite (account_id, inv_id) VALUES ($1, $2) RETURNING *"
    const result = await pool.query(sql, [account_id, inv_id])
    return result.rows[0]
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Listar todos os favoritos de um utilizador (com detalhes do carro)
* *************************** */
async function getFavoritesByAccountId(account_id) {
  try {
    const sql = `SELECT f.favorite_id, i.inv_id, i.inv_make, i.inv_model, i.inv_year, i.inv_price, i.inv_thumbnail 
                 FROM favorite f 
                 JOIN inventory i ON f.inv_id = i.inv_id 
                 WHERE f.account_id = $1`
    const result = await pool.query(sql, [account_id])
    return result.rows
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Remover um favorito
* *************************** */
async function removeFavorite(favorite_id) {
  try {
    const sql = "DELETE FROM favorite WHERE favorite_id = $1"
    return await pool.query(sql, [favorite_id])
  } catch (error) {
    return error.message
  }
}

module.exports = { addFavorite, getFavoritesByAccountId, removeFavorite }