const express = require('express');
let jwt = require('jsonwebtoken');
let middleware = require('./middleware.js');

// Access secret key
let config = require('./config.js');
let app = express();

app.use(express.json());

// Sets the port
const port = 5000;

//Login page
function login(req, res) {
  // This access the username and password from the body of the request
  let { username, password } = req.body;

  // Creating mocked username
  let mockedUsername = "admin";
  let mockedPassword = "password";

  // if we have a username and password from the body lets progress
  if (username && password) {
    if (username === mockedUsername && password === mockedPassword) {
      
      // The below is creating the token and coding it.
      let token = jwt.sign(
        {username: username},
        config.secret,
        { expiresIn: '24h'}
      );

      // The below is sending the token back to the client and says the browser needs to use the token to access the app. 
      res.json ( {
        success: true,
        message: 'Authentication successful',
        token: token
      })
      // Below is saying if the token does not match.
    } else {
      res.status(403).json({
        success: false,
        message: 'Incorrect username or password'
      });
    }
    // If we don't have a username or password
  } else {
    res.status(400).json ({
      success: false,
      message: 'Authentication failed, please check the request'
    })
  }
}

// Route index page
function index(req, res) {

  if ( req.decoded.username === "admin") {
    res.json({
      success: true,
      message: 'Admins index page'
    })
  } else {
    res.json({
      success: true,
      message: 'Index page'
    });
  } 
}

// Sets a get Route
// Login route
app.post('/login', login);

// The middleware will be run before the user reaches the index. This checks the token and if they match.
app.get('/', middleware.checkToken, index );

// listens on the port
app.listen(port, () => console.log(`Server is listening on port ${port}`))