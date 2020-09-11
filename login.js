require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const low = require("lowdb");
const FileAsync = require("lowdb/adapters/FileAsync");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const adapter = new FileAsync("db.json");
low(adapter)
  .then(db => {
    app.post("/auth/login", async (req, res) => {
      console.log("POST /auth/login");

      const user = db
        .get("users")
        .find({ email: req.body.email })
        .value();

      if (!user) res.send(new Error({ status: 400 }));

      try {
        const validated = await bcrypt.compare(
          req.body.password,
          user.password
        );
        if (!validated) res.send(new Error({ status: 401 }));

        const { email } = req.body;
        const access_token = jwt.sign(
          { email },
          process.env.ACCESS_TOKEN_SECRET
        );
        res.json({ access_token });
      } catch (err) {
        res.send(new Error({ status: 500 }));
      }
    });

    return db.defaults({ users: [] }).write();
  })
  .then(() => {
    app.listen(5000, () => console.log("listening on port 5000"));
  });
