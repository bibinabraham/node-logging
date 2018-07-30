const express = require("express");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const config = require("config");

const logger = require("./middleware/logger");
const courses = require("./data/courses");

// middlewares
app.use(express.json());
app.use(helmet());
app.use(logger);

app.get("/", (req, res) => {
  res.send("Courses Overview");
});

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

app.get("/api/courses/:id", (req, res) => {
  const result = courses.find(item => item.id === +req.params.id);
  if (result) res.send(result);
  else res.status(404).send("Course not found");
});

app.post("/api/courses", (req, res) => {
  const newCourse = {
    id: courses.length + 1,
    name: req.body.name
  };
  courses.push(newCourse);
  res.send(newCourse);
});

console.log(`Configuration : ${config.environment}`);
console.log(`NODE_ENV : ${app.get("env")}`);
// console.log(`Value from custom env variable: ${config.get('custom.variable')}`);

if (config.get("environment") === "development") {
  app.use(morgan("tiny"));
  console.log("Using morgan");
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
