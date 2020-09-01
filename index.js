const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;
const database = "banking";
const mongoose = require("mongoose");

app.use(
  bodyParser.json({
    limit: "100mb",
  })
);

app.use(
  bodyParser.urlencoded({
    limit: "100mb",
    extended: true,
  })
);

//Routes import
const account_routes = require("./routes/account.routes");
const customer_routes = require("./routes/customer.routes");
const account_actions_routes = require("./routes/account-actions.routes");

//API routes
app.use("/api", account_routes);
app.use("/api", customer_routes);
app.use("/api", account_actions_routes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
  // MongoDB
  mongoose.connect(
    "mongodb://localhost:27017/" + database,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    (err) => {
      if (err) throw err;
      console.log("MongoDB: \x1b[32m%s\x1b[0m", "Online");
    }
  );
});
