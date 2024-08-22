const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
const indexRouter = require("./routes/index.router");


// Root route
app.get("/", (req, res) => {
  res.send({ msg: "Welcome to Soap to XSLT" });
});

//Route Prefixes
app.use("/api/", indexRouter);

// Invalid URL response
app.all("*", function (req, res) {
  res.send("Invalid URL");
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

