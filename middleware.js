let jwt = require('jsonwebtoken');
const config = require('./config.js');

// The below function checks the token. If it matches it moves to the next function which would be getting the user to the page.
let checkToken = (req, res, next) => {

  // The below says it is either going to retrieve the token from x access if not there authorization if not there then put an empty string.
  let token = req.headers[ 'x-access-token' ] || req.headers[ 'authorization' ] || "";

  // If we have the token we're then going to see if it starts with Bearer (auth) then run the below command
  if (token.startsWith('Bearer ')) {
    // Then slices Bearer from the token and we're left with the token itself
    token = token.slice(7, token.length);
  }

  // If we have the token then run the commands in the if statement. The config.secret allows us to decode the authentication.
  // Token comes from the request made from the client.
  // Secret if valid should be able to be decoded from the way we made the token.
  // 
  if (token) {
    jwt.verify(token, config.secret, (err, decoded) => {
      // If there is an error then run the below
      if (err) {
        // 403 returns a forbidden message
        return res.status(403).json({
          success: false,
          message: 'Token is not valid'
        });
        // If there is no error and we have found a token in the header.
      } else {
        console.log(decoded);        
        req.decoded = decoded;
        // Next then moves the user to the page and gives access
        next();
      }
    })
    // The else is if there isn't a token supplied
  } else {
    // 403 returns a forbidden message
    return res.status(403).json ({
      success: false, 
      message: 'Authorization token has not been supplied'
    })
  }
};

module.exports = {
  checkToken: checkToken
};