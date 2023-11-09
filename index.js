const express = require("express");
const cors = require("cors");
const winston = require("winston");

const app = express();

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "combined.log", level: "info" }),
    new winston.transports.File({ filename: "error.log", level: "error" }),
  ],
});

// Define CORS options
const corsOptions = {
  origin: "http://localhost:4200",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

const login_code = "101010";
const login_text = "Login Request";
const login_mti = "0100";

const allUsers = [
  { phone: "254728736229", password: "1234" },
  { phone: "254710295282", password: "8907" },
  { phone: "254712979122", password: "6585" },
];

app.use(cors(corsOptions));

app.use(express.json());

app.get("/test", (req, res) => {
  res.send("Hello, World!");
});

const crypto = require("crypto");

app.post("/login", (req, res) => {
  const fieldsToCheck = ["f2", "f37", "f11", "f12", "f13", "f3", "f7", "f56"];

  const missingFields = fieldsToCheck.filter((field) => !(field in req.body));

  if (missingFields.length > 0) {
    res.json({ status_code: 1003, message: "Missing Fields" });
  } else {
    if (
      login_mti === req.body.mti &&
      login_code === req.body.f3 &&
      login_text === req.body.f68
    ) {
      const result = allUsers.find(
        ({ phone, password }) =>
          phone === req.body.f2 && password === req.body.f56
      );

      if (result) {
        const token = crypto.randomBytes(16).toString("hex");

        const tokenExpiration = new Date(Date.now() + 5 * 60 * 1000);

        res.json({
          status_code: 1000,
          message: "Successful Login",
          data: { token, tokenExpiration },
        });
      } else {
        res.json({ status_code: 1001, message: "Invalid Credentials" });
      }
    }
  }
});

app.post("/register", (req, res) => {
  const fieldsToCheck = ["name", "password", "confirmPassword", "phone"];

  const missingFields = fieldsToCheck.filter((field) => !(field in req.body));
  console.log(req.body);

  if (missingFields.length > 0) {
    res.json({ status_code: 1003, message: "Missing Fields" });
  } else {
    const result = allUsers.find(({ phone }) => phone === req.body.phone);
    if (result) {
      res.json({ status_code: 1002, message: "User Exists. Proceed to Login" });
    } else {
      const newUser = req.body;
      allUsers.push(newUser);
      console.log("allUsers:", allUsers);
      if (newUser !== undefined) {
        res.json({
          status_code: 1000,
          message: "Successful Registration. Proceed to Login",
        });
      } else {
        res.json({ status_code: 1001, message: "Unsuccessful Registration" });
      }
    }
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
