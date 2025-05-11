// backend/server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const YAML = require("yamljs");
const path = require("path");

const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./dashboard");
const studentRoutes = require("./studentRoutes");
const driveRoutes = require("./driveRoutes");
const reportRoutes = require("./reportRoutes");

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use("/api/auth", authRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/students", studentRoutes);

app.use("/api/drives", driveRoutes);

app.use("/api/reports", reportRoutes);

const swaggerDocument = YAML.load(path.join(__dirname, "swagger.yaml"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
