const pg = require("pg");
const uuid = require("uuid");

const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/acme_travel_db"
);

const createTables = async () => {
  const SQL = `
    DROP TABLE IF EXISTS vacations;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS places;

    CREATE TABLE users(
        id UUID PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE
    );
    CREATE TABLE places(
        id UUID PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE
    );
    CREATE TABLE vacations(
        id UUID PRIMARY KEY,
        user_id UUID REFERENCES users(id) NOT NULL,
        place_id UUID REFERENCES places(id) NOT NULL,
        travel_date DATE NOT NULL
    );
  `;
  await client.query(SQL);
};
const createUser = async ({ name }) => {
  const SQL = `
    INSERT INTO users(id, name) 
    VALUES ($1, $2) RETURNING *;
  `;
  const dbResponse = await client.query(SQL, [uuid.v4(), name]);
  return dbResponse.rows[0];
};
const fetchUsers = async () => {
  const SQL = `
        SELECT * FROM users;
    `;
  const dbResponse = await client.query(SQL);
  return dbResponse.rows;
};
const createPlace = async ({ name }) => {
  const SQL = `
    INSERT INTO places(id, name) 
    VALUES ($1, $2) RETURNING *;
  `;
  const dbResponse = await client.query(SQL, [uuid.v4(), name]);
  return dbResponse.rows[0];
};
const fetchPlaces = async () => {
  const SQL = `
          SELECT * FROM places
      `;
  const dbResponse = await client.query(SQL);
  return dbResponse.rows;
};
const createVacation = async ({ user_id, place_id, travel_date }) => {
  const SQL = `
        INSERT INTO vacations(id, user_id, place_id, travel_date)
         Values($1, $2, $3, $4) RETURNING *
    `;
  const dbResponse = await client.query(SQL, [
    uuid.v4(),
    user_id,
    place_id,
    travel_date,
  ]);
  return dbResponse.rows[0];
};
const fetchVacations = async () => {
    const SQL = `
            SELECT * FROM vacations
        `;
    const dbResponse = await client.query(SQL);
    return dbResponse.rows;
  };
const destroyVacation = async ({ id, user_id }) => {
    const SQL = `
        DELETE FROM vacations WHERE id=$1 AND user_id=$2
    `;
    await client.query(SQL, [id, user_id]);
} 

module.exports = {
  client,
  createTables,
  createPlace,
  createUser,
  createVacation,
  fetchPlaces,
  fetchUsers,
  fetchVacations,
  destroyVacation,
};
