const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');


const pool = new Pool({
  user: 'vagrant',
  host: 'localhost',
  database: 'lightbnb',
  password: 123,
  port: 5432
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  
  return pool.query(`
    SELECT * FROM users
    WHERE email = $1
  `, [email])
    .then(res => res.rows[0]);
  
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool.query(`
    SELECT * FROM users
    WHERE id = $1
  `, [id])
    .then(res => res.rows[0]);
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  const { name, email, password } = user;
  return pool.query(`
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING *;
  `, [name, email, password])
    .then(res => res.rows[0]);
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool.query(`
    SELECT reservations.*, properties.*, AVG(rating) AS average_rating
    FROM reservations
    JOIN properties ON properties.id = property_id
    JOIN property_reviews ON property_reviews.property_id = properties.id
    WHERE (now()::date) > end_date AND reservations.guest_id = $1
    GROUP BY reservations.id, properties.id
    ORDER BY start_date
    LIMIT $2;
  `, [guest_id, limit])
    .then(res => res.rows);
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  const queryParams = [];

  //Syntax checker
  const checker = () => queryParams.length ? ' AND' : 'WHERE';

  //Main shell of query
  let queryString = `
   SELECT properties.*, AVG(property_reviews.rating) AS average_rating
   FROM properties
   JOIN property_reviews ON properties.id = property_id
   `;

  //Collection of checks for filters utilizing checker
  if (options.city) {
    let syntax = checker();
    queryParams.push(`%${options.city}%`);
    queryString += `${syntax} city LIKE $${queryParams.length}`;
  }

  if (options.owner_id) {
    let syntax = checker();
    queryParams.push(`${options.owner_id}`);
    queryString += `${syntax} owner_id = $${queryParams.length}`;
  }

  if (options.minimum_price_per_night) {
    let syntax = checker();
    queryParams.push(`${options.minimum_price_per_night}`);
    queryString += `${syntax} cost_per_night > $${queryParams.length}`;
  }

  if (options.maximum_price_per_night) {
    let syntax = checker();
    queryParams.push(`${options.maximum_price_per_night}`);
    queryString += `${syntax} cost_per_night < $${queryParams.length}`;
  }

  // Mandatory grouping
  queryString += ` 
    GROUP BY properties.id`;

  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    queryString += `
    HAVING AVG(property_reviews.rating) > $${queryParams.length}`;
  }

  //Mandatory ordering
  queryParams.push(limit);
  queryString += `
    ORDER BY cost_per_night
    LIMIT $${queryParams.length}
  `;

  return pool.query(queryString, queryParams)
    .then(res => {
      return res.rows;
    });
  
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const keys = Object.keys(property);
  
  //Building a query string with any number of variables brought through the property parameter object
  let valueDeclarationToTable = '(';
  let valuesToInput = [];
  let scrubbingKey = `(`;

  let queryString = `INSERT INTO properties `;
  
  keys.forEach(key => {
    valueDeclarationToTable += (keys[keys.length - 1] === key ? `${key})` : `${key}, `);
    valuesToInput.push(property[key]);
    scrubbingKey += (keys[keys.length - 1] === key ? `$${valuesToInput.length})` : `$${valuesToInput.length}, `);
  });

  queryString = queryString + valueDeclarationToTable + ' VALUES ' + scrubbingKey + ';';

  
  return pool.query(queryString, valuesToInput)
    .then(res => res.rows);
};
exports.addProperty = addProperty;



//// Add RETURNING * to the end of the saved query
/* All object items MUST come EXCEPT denoted by ' --X'
{
  owner_id: int,
  title: string,
  description: string, --X
  thumbnail_photo_url: string,
  cover_photo_url: string,
  cost_per_night: string,
  street: string,
  city: string,
  province: string,
  post_code: string,
  country: string,
  parking_spaces: int,
  number_of_bathrooms: int,
  number_of_bedrooms: int
}
*/