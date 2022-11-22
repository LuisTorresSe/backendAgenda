// require("dotenv").config();
const cors = require("cors");
const express = require("express");
const Users = require("./models/agenda");
const app = express();
const port = 3001;
app.use(express.static("build"));
app.use(express.json());
app.use(cors());

const errorHandler = (error, request, response, next) => {
  console.error(error.stack);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }
  if (error.name === "ValidationError") {
    return response.status(404).send({ error: error.message });
  }
};
app.get("/api/agenda", (req, res, next) => {
  Users.find({})
    .then((users) => {
      res.json(users);
    })
    .catch((err) => next(err));
});

app.get("/api/agenda/:name", (req, res, next) => {
  const name = req.params.name;
  Users.find({ name: name })
    .then((user) => {
      console.log(user);
      if (user.length !== 0) {
        res.json(user);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => next(err));
});

app.post("/api/agenda", (req, res, next) => {
  const body = req.body;
  const { name, number } = body;
  if (name === undefined || number === undefined) {
    res.status(400).json({ error: "information is missing" });
  }
  const user = new Users({
    name: name,
    number: number,
  });
  user
    .save()
    .then((userSaved) => userSaved.toJSON())
    .then((savedAndFormattedUser) => res.json(savedAndFormattedUser))
    .catch((err) => next(err));
});

app.delete("/api/agenda/:id", (req, res, next) => {
  const idUser = req.params.id;
  Users.findByIdAndDelete({ _id: idUser }).then((status) =>
    res
      .status(200)
      .json({ message: `Delete User` })
      .catch((err) => next(err))
  );
});

app.use(errorHandler);

app.listen(port);
