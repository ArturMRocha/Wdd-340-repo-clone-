const { Pool } = require("pg")
require("dotenv").config()

/* ***********************
 * Connection Pool
 * SSL Object modification for Render
 * *********************** */
let pool
if (process.env.NODE_ENV === "development") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Isso permite certificados self-signed localmente
    },
  })
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // ISSO AQUI É O QUE RESOLVE O ERRO NO RENDER!
    },
  })
}

// Configuração para o Render (Produção)
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  })

// Exportando a query para ser usada nos models
module.exports = {
  async query(text, params) {
    try {
      const res = await pool.query(text, params)
      console.log("executed query", { text })
      return res
    } catch (error) {
      console.error("error in query", { text })
      throw error
    }
  },
}

module.exports = pool