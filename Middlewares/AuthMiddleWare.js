const jwt = require("jsonwebtoken");
const logger = require("../Utils/LoggerUtil.js");
const env = require("dotenv").config({ path: require("find-config")("env") });

// this middleware verifies jwt token for every request
module.exports = async (req, res, next) => {
    try {
      logger.request(req);
      let token = req.cookies.jwt;

      // verify token from cookie
      let response = await jwt.verify(token, env.parsed.JWT_SECRET_KEY);
      if(response){
          // If jwt is verifed then it proceed to next route
          next();
       }

       // here we can send mail to service owners to intimate un authorized access
       return logger.error(req, res, 401, "Un Authorized Request");
    } catch (error) {
      return logger.error(req, res, 500, "Error During Authorization");
    }
  };