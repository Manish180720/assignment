const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./Routes/User");
const bodyParser = require("body-parser");
const app = express();
const port = 5000;
const dotenv = require("dotenv");

dotenv.config();

app.get("/", (req, res) => {
  res.send("Hello, this is your Express server!");
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/user", User);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb://127.0.0.1:27017/mydb", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
};

connectDB();
