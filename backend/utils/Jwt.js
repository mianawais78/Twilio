const jwt = require("jsonwebtoken");
const SECRECT_KEY = "SOME_SECRECT_KEY";

const createJwt = (username) => {
  const token = jwt.sign({ username }, SECRECT_KEY);
  return token;
};

const verifyToken = (token) => {
  const data = jwt.verify(token, SECRECT_KEY);
  return data;
};

module.exports = {
  createJwt,
  verifyToken,
};
