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
app.use(cors({
  origin: ["https://ecommerce-frontend-3awr.onrender.com","http://localhost:3002/"],
  methods: ["POST", "GET", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));
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

app.listen(8800, () => {
  console.log("Backend server is running!");
});

// Logging all requests for debugging purposes
app.use((req, res, next) => {
  console.log(`${req.method} request for '${req.url}'`);
  next();
});
