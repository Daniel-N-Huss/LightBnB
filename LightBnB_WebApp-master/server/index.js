const { Pool } = require('pg')

const pool = new Pool({
  user: 'vagrant',
  host: 'localhost',
  database: 'lightbnb',
  password: 123,
  port: 5432
})

module.exports = {
  query: (text, params,) => {
    return pool.query(text, params)
  }
}