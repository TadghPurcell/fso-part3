require("dotenv").config();
const Person = require("./models/person");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};
app.use(cors());

app.use(express.static("build"));

app.use(express.json());

app.use(requestLogger);

app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      tokens.addContact(),
    ].join(" ");
  })
);
morgan.token("addContact", () => {
  return "";
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => res.json(persons));
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatedPerson) => res.json(updatedPerson))
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((result) => res.status(204).end())
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
  const body = req.body;

  // Person.find({}).then((persons) => {
  //   if (
  //     persons.some(
  //       (person) => person.name.toLowerCase() === body.name?.toLowerCase()
  //     )
  //   )
  //     return res.status(400).json({ error: "name must be unique" });
  // });

  // if (!body.name) {
  //   return res.status(404).json({ error: "name missing" });
  // }
  // if (!body.number) {
  //   return res.status(404).json({ error: "number missing" });
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  const { name, number } = person;

  person.save().then((savedPerson) => {
    return res.send(savedPerson);
  });

  morgan.token("addContact", () => {
    return JSON.stringify({ name, number });
  });
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  console.error(error.name);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
