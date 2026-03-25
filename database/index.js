const { Pool } = require("pg")
require("dotenv").config()

/* ***********************
 * Connection Pool
 * *********************** */
let pool

if (process.env.NODE_ENV === "development") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  })
} else {
  // CONFIGURAÇÃO DE PRODUÇÃO (RENDER)
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Ignora o erro de certificado auto-assinado
    },
  })
}

// Teste de conexão imediato para o log
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('ERRO DE CONEXÃO COM O BANCO:', err.stack)
  } else {
    console.log('CONECTADO AO BANCO COM SUCESSO EM:', res.rows[0].now)
  }
})

module.exports = pool