const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors"); // Import cors

const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const movieRoute = require("./routes/movies");
const listRoute = require("./routes/lists");

dotenv.config();
origin: ["https://movie-app-1-ocg6.onrender.com","http://localhost:3000/","http://localhost:3001/","http://localhost:3002/"],
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

const app = express();
app.use(cors()); // Enable CORS for all routes

app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/movies", movieRoute);
app.use("/api/lists", listRoute);

app.listen(8800, () => {
  console.log("Backend server is running!");
  console.log(`Example app listening on port ${port}`)
});
