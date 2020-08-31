const express = require("express");
const app = express();
const port = 3000;
const database = "banking";
const mongoose = require("mongoose");


//Routes import
const account_routes = require("./routes/account.routes");

//API routes
app.use("/api", account_routes);

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
