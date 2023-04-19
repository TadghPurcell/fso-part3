require("dotenv").config();
const Person = require("./models/person");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();

// let persons = [
//   {
//     id: 1,
//     name: "Arto Hellas",
//     number: "040-123456",
//   },
//   {
//     id: 2,
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//   },
//   {
//     id: 3,
//     name: "Dan Abramov",
//     number: "12-43-234345",
//   },
//   {
//     id: 4,
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//   },
// ];

app.use(cors());

app.use(express.static("build"));

app.use(express.json());
morgan.token("type", (req, res, method) => {
  return JSON.stringify(req);
});

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

// const findPerson = (id) => persons.find((person) => person.id === +id);

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => res.json(persons));
});

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id).then((person) => res.json(person));
});

app.delete("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id).then((person) => res.json(person));
  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  // const sameName = persons.some(
  //   (person) => person.name.toLowerCase() === body.name?.toLowerCase()
  // );

  const sameName = Person.find({}).then((persons) =>
    persons.some((person) => {
      console.log(person);
      console.log(body);
      return person.name.toLowerCase() === body.name?.toLowerCase();
    })
  );

  console.log(sameName);

  if (!body.name) {
    return res.status(404).json({ error: "name missing" });
  }
  if (!body.number) {
    return res.status(404).json({ error: "number missing" });
  }

  // if (sameName) {
  //   return res.status(400).json({ error: "name must be unique" });
  // }

  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  const { name, number } = person;

  morgan.token("addContact", () => {
    return JSON.stringify({ name, number });
  });

  person.save().then((savedPerson) => response.json(savedPerson));
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
