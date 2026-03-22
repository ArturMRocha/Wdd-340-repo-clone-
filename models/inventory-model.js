// models/inventory-model.js

// 1. Importa a conexão com o banco de dados (ajuste o caminho se a sua pasta for diferente)
const pool = require("../database/")

/* ***************************
 * Get all classification data (Usado para montar a barra de navegação)
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 * Get all inventory items by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows // IMPORTANTE: Tem que retornar data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 * TAREFA 1: Get single inventory item by inv_id (A NOVA FUNÇÃO!)
 * ************************** */
async function getInventoryById(inv_id) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.inventory WHERE inv_id = $1",
      [inv_id]
    );
    // Retorna apenas o primeiro (e único) registro encontrado
    return data.rows[0]; 
  } catch (error) {
    console.error("getInventoryById error " + error);
  }
}

// 2. Exporta TODAS as funções para que o Controller possa usá-las
module.exports = { 
  getClassifications, 
  getInventoryByClassificationId, 
  getInventoryById 
};