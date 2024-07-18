const {
  client,
  createTables,
  createPlace,
  createUser,
  createVacation,
  fetchPlaces,
  fetchUsers,
  fetchVacations,
  destroyVacation,
} = require("./db");

// function to create database tables, seed data into tables
const init = async () => {
  await client.connect();

  await createTables();
  console.log("Tables created.")
  const [joe, caleb, ryan, chi, cle] = await Promise.all([
    createUser({ name: "Joe" }),
    createUser({ name: "Caleb" }),
    createUser({ name: "Ryan" }),
    createPlace({ name: "NY" }),
    createPlace({ name: "CHI" }),
    createPlace({ name: "CLE" }),
  ]);
  console.log("Users", await fetchUsers());
  console.log("Places", await fetchPlaces());

  const [vacation, vacation1] = await Promise.all([
    createVacation({
      user_id: caleb.id,
      place_id: chi.id,
      travel_date: "06/02/2019",
    }),
    createVacation({
      user_id: joe.id,
      place_id: cle.id,
      travel_date: "10/05/2014",
    }),
  ]);
  console.log("Vacations", await fetchVacations());
  await destroyVacation({ id: vacation.id, user_id: vacation.user_id });
  console.log("Vacations after delete", await fetchVacations());


  await client.end();
};
init();
