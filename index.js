const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.use(cors());

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

const findPerson = (id) => persons.find((person) => person.id === +id);

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
  );
});

app.get("/api/persons/:id", (req, res) => {
  const person = findPerson(req.params.id);

  person ? res.json(person) : res.status(404).end();
});

app.delete("/api/persons/:id", (req, res) => {
  const deletedPerson = findPerson(req.params.id);

  persons = persons.filter((person) => person !== deletedPerson);

  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  const sameName = persons.some(
    (person) => person.name.toLowerCase() === body.name?.toLowerCase()
  );

  if (!body.name) {
    return res.status(404).json({ error: "name missing" });
  }
  if (!body.number) {
    return res.status(404).json({ error: "number missing" });
  }

  if (sameName) {
    return res.status(400).json({ error: "name must be unique" });
  }

  const newPerson = {
    id: Math.trunc(Math.random() * 10000),
    name: body.name,
    number: body.number,
  };

  const { name, number } = newPerson;

  morgan.token("addContact", () => {
    return JSON.stringify({ name, number });
  });
  persons = [...persons, newPerson];

  res.json(persons);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
