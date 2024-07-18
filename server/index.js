const express = require("express");
const {
  createVacation,
  fetchPlaces,
  fetchUsers,
  fetchVacations,
  destroyVacation,
  client,
} = require("./db");

const server = express();
// connect to db client
client.connect();

//middleware to use before all routes

server.use(express.json()); //parses the request body so our route can access it

server.get("/api/users", async (req, res, next) => {
  try {
    res.send(await fetchUsers());
  } catch (error) {
    next(error);
  }
});
server.get("/api/vacations", async (req, res, next) => {
  try {
    res.send(await fetchVacations());
  } catch (error) {
    next(error);
  }
});
server.get("/api/places", async (req, res, next) => {
  try {
    res.send(await fetchPlaces());
  } catch (error) {
    next(error);
  }
});
server.post("/api/users/:user_id/vacations", async (req, res, next) => {
  try {
    res.status(201).send(
      await createVacation({
        user_id: req.params.user_id,
        place_id: req.body.place_id,
        travel_date: req.body.travel_date,
      })
    );
  } catch (error) {
    next(error);
  }
});
server.delete("/api/users/:user_id/vacations/:id", async (req, res, next) => {
  try {
    await destroyVacation({ user_id: req.params.user_id, id: req.params.id });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});
//error handling route which returns an object with an error property
server.use((err, req, res, next) => {
  res.status(err.status || 500).send({ error: err.message || err });
});

const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}`);
  });