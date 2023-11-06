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
  origin: "http://localhost:8080",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

const login_code = "101010";
const login_text = "Login Request";
const login_mti = "0100";

const allUsers = [
  { phone: "254728736229", password: 1234 },
  { phone: 254710295282, password: 8907 },
  { phone: 254712979122, password: 6585 },
];

// const newPhone = this.phone.replace(/^0|254/g, "");
// const NP = "254" + newPhone;

app.use(cors(corsOptions));

app.use(express.json());

app.get("/test", (req, res) => {
  res.send("Hello, World!");
});

app.post("/login", (req, res) => {
  const fieldsToCheck = ["f2", "f37", "f11", "f12", "f13", "f3", "f7", "f56"];

  const missingFields = fieldsToCheck.filter((field) => !(field in req.body));
  console.log(req.body);

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
      //   console.log(result);
      if (result) {
        res.json({ status_code: 1000, message: "Successful Login" });
      } else {
        res.json({ status_code: 1001, message: "Invalid Credentials" });
      }
    }
  }
});
app.post("/register", (req, res) => {
    const fieldsToCheck = ["f2", "f37", "f11", "f12", "f13", "f3", "f7", "f56"];
  
    const missingFields = fieldsToCheck.filter((field) => !(field in req.body));
    console.log(req.body);
  
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
        //   console.log(result);
        if (result) {
          res.json({ status_code: 1000, message: "Successful Login" });
        } else {
          res.json({ status_code: 1001, message: "Invalid Credentials" });
        }
      }
    }
  });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
