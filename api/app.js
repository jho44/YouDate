const express = require("express"),
  app = express(),
  PORT = 5000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));

//ROUTES
const testRoutes = require("./routes/test");
app.use("/test", testRoutes);

app.listen(PORT, () => console.log("Server listening on port " + PORT + "."));
