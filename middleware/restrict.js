const jwt = require("jsonwebtoken");

function restrict() {
  const roles = ["basic", "admin"];
  return async (req, res, next) => {
    const authError = {
      message: "Invalid credentials",
    };

    try {
      // express-session will automatically get the session ID from the cookie
      // header, and check to make sure it's valid and the session for this user exists.
      //   if (!req.session || !req.session.user) {
      //     return res.status(401).json(authError);
      //   }

      const token = req.headers.authorization;

      if (!token) {
        res.status(401).json(authError);
      }

      console.log(req.headers);

      // decode the token, re-sign the payload and check if the signature is valid
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).json(authError);
        }

        // check that decoded.userRole equals role

        // if (decoded.userRole !== role) {
        //   res.status(403).json({
        //     msg: "You are not authorized to perform this action",
        //   });
        // }

        // if (role && roles.indexOf(decoded.userRole) < roles.indexOf(role)) {
        //   return res.status(403).json({
        //     msg: "You are not allowed here",
        //   });
        // }
        // we know the user is authorized at this point
        // make the token's payload available to other middleware functions
        req.token = decoded;
        next();
      });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = restrict;
