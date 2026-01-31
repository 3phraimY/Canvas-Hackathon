const express = require("express");
const cors = require("cors");
require("dotenv").config();

const {
  listCourses,
  courseAssignments,
} = require("./controllers/CanvasAPIController");

const app = express();

app.use(cors());

// Route definitions
app.get("/listCourses", listCourses);

app.listen(3000, () => console.log("Server running on port 3000"));
module.exports = app;
