require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Person = require('./models/person');

const app = express();

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method);
  console.log('Path:  ', request.path);
  console.log('Body:  ', request.body);
  console.log('---');
  next();
};
app.use(cors());

app.use(express.static('build'));

app.use(express.json());

app.use(requestLogger);

app.use(
  morgan((tokens, req, res) =>
    [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'),
      '-',
      tokens['response-time'](req, res),
      'ms',
      tokens.addContact(),
    ].join(' ')
  )
);
morgan.token('addContact', () => '');

app.get('/info', (req, res) => {
  Person.find({}).then(persons => {
    res.send(`Phonebook has info for ${persons.length} people ${new Date()}`);
  });
});

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => res.json(persons));
});

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch(error => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body;

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => res.json(updatedPerson))
    .catch(error => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch(error => next(error));
});

app.post('/api/persons', (req, res, next) => {
  const { body } = req;

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  const { name, number } = body;

  person
    .save()
    .then(savedPerson => res.send(savedPerson))
    .catch(error => {
      return next(error);
    });

  morgan.token('addContact', () => JSON.stringify({ name, number }));
});

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
  return;
};

app.use(errorHandler);

const { PORT } = process.env;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
