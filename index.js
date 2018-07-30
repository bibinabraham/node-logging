const express = require("express");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const config = require("config");
const Joi = require("joi");

const logger = require("./middleware/logger");
const courses = require("./data/courses");
const utils = require("./utils/common");

// middlewares
app.use(express.json());
app.use(helmet());
app.use(logger);

console.log(`Configuration : ${config.environment}`);
console.log(`NODE_ENV : ${app.get("env")}`);
// console.log(`Value from custom env variable: ${config.get('custom.variable')}`);

if (config.get("environment") === "development") {
  app.use(morgan("tiny"));
  console.log("Using morgan");
}

// SCHEMAS

const COURSE_SCHEMAS = {
  id: Joi.number()
    .integer()
    .label("ID"),
  course: Joi.object().keys({
    name: Joi.string()
      .min(3)
      .required()
  })
};

// REST APIs
app.get("/", (req, res) => {
  res.send("Courses Overview");
});

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

app.get("/api/courses/:id", (req, res) => {
  const { error: joiError, value: joiValue } = Joi.validate(req.params.id, COURSE_SCHEMAS.id);

  if (joiError) {
    res.status(500).send(utils.extractJoiErrorMessages(joiError));
  } else {
    const result = courses.find(item => item.id === joiValue);
    if (result) res.send(result);
    else res.status(404).send("Course not found");
  }
});

app.post("/api/courses", (req, res) => {
  const { error: joiError, value: joiValue } = Joi.validate(req.body, COURSE_SCHEMAS.course);

  if (joiError) {
    res.status(500).send(utils.extractJoiErrorMessages(joiError));
  } else {
    const newCourse = {
      id: courses.length + 1,
      name: joiValue.name
    };
    courses.push(newCourse);
    res.send(newCourse);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
