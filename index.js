const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
morgan.token("body", (request, response) => {
  if (request.method === "POST") {
    return JSON.stringify(request.body);
  }
});
app.use(
  morgan(`:method :url :status :res[content-length] - :response-time ms :body`)
);

const requestLogger = (request, response, next) => {
  console.log("Method", request.method);
  console.log("Path", request.path);
  console.log("Body", request.body);
  console.log("---");
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({
    error: "unknown endpoint",
  });
};

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
  return maxId + 1;
};

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

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((item) => item.id === id);
  response.json(person);
});

app.post("/api/persons/", (request, response) => {
  if (!request.body.name || !request.body.number) {
    return response.json({
      error: "name or number missing",
    });
  }
  if (
    persons.find(
      (item) => item.name.toLowerCase() === request.body.name.toLowerCase()
    )
  ) {
    return response.json({
      error: "name must be unique",
    });
  }
  const maxId = generateId();
  const person = {
    id: maxId,
    name: request.body.name,
    number: request.body.number,
  };
  persons = persons.concat(person);
  response.json(persons);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((item) => item.id === id);
  if (!person) {
    return response.status(404).json({
      error: "person not found",
    });
  }
  persons = persons.filter((item) => {
    return item.id !== id;
  });
  response.json(persons);
});

app.get("/info", (request, response) => {
  const date = new Date();
  response.send(
    `<div><p>Phonebook has info for ${persons.length} people</p><p>${date}</p></div>`
  );
});

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is runing on port ${PORT}`);
});
