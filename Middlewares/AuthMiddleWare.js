const jwt = require("jsonwebtoken");
const logger = require("../Utils/LoggerUtil.js");
const env = require("dotenv").config({ path: require("find-config")("env") });
const excludedRouteList = ['register','login', 'forgetPassword','updatePassword'];

// this middleware verifies jwt token for every request
module.exports = async (req, res, next) => {
    try {
      logger.request(req);

      // auth check occurs only after login successfull
      if(isInExcludedList(req.originalUrl)){
        next();
        return;
      }
      let token = req.cookies.token;

      // verify token from cookie
      let response = await jwt.verify(token, env.parsed.JWT_SECRET_KEY);
      if(response){
        // For session maintainance
        if(req.originalUrl.includes("viewProfile"))
              req.body = response.userData;
          // If jwt is verifed then it proceed to next route
          next();
          return;
       }

       // here we can send mail to service owners to intimate un authorized access
       return logger.error(req, res, 401, "Un Authorized Request");
    } catch (error) {
      return logger.error(req, res, 401, "Un Authorized Request", error);
    }
  };

 // check wheather the request is in excluded route list 
  function isInExcludedList(url){
   return excludedRouteList.find(excludeRoute => url.includes(excludeRoute));
  }