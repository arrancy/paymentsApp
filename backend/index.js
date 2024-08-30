const express = require("express");
const { rootRouter } = require("./routes/index");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./config");

app.use(cors());
app.use(express.json());
app.use("/api/v1", rootRouter);

app.get("/me", (req, res) => {
  if (!req.headers.authorization) {
    return res
      .status(200)
      .json({ msg: "token does not exist", existsAndValid: false });
  }

  let token = req.headers.authorization.slice(
    7,
    req.headers.authorization.length
  );
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.status(200).json({ msg: "valid token", existsAndValid: true });
  } catch {
    return res
      .status(200)
      .json({ msg: "invalid token", existsAndValid: false });
  }
});
app.listen(4000, () => {
  console.log(" the server is running on port 4000");
});
