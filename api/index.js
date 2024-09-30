const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const movieRoute = require("./routes/movies");
const listRoute = require("./routes/lists");
const cors = require('cors');

dotenv.config();
const corsOptions = {
  origin:'https://movie-app-1-ocg6.onrender.com',
  credentials:true
}
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("DB Connection Successful"))
  .catch((err) => {
    console.error(err);
  });



app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/movies", movieRoute);
app.use("/api/lists", listRoute);

const PORT = process.env.PORT || 8800;  // Render assigns process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// Logging all requests for debugging purposes
app.use((req, res, next) => {
  console.log(`${req.method} request for '${req.url}'`);
  next();
});
