// importing required packages

const express= require('express');
const passport= require('passport')
const path= require('path')
const googleapi = require('./googleapikey')
const GoogleStrategy= require('passport-google-oauth20').Strategy


var app= express()

// Express-Session 
const session = require('express-session');
app.use(session( {
  secret:['fsdfsdfsdafdscc11rr', 'kpjffsffas'],
  saveUninitialized: false,
  resave: false
}))

// DATOS DE LA APP REGISTRADOS EN GOOGLE DEVELOPPER
// client id is the parameter that we will get from the google developer console
CLIENT_ID=googleapi.client_id
CLIENT_SECRET=googleapi.client_secret
CALLBACK_URL=googleapi.redirect_uris[0]

// port number 
PORT=8081

// configuring passport middleware
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser( function(id, done) {
  done(null, id)
})

passport.deserializeUser( function(id, done) {
  done(null, id)
})

// following middleware will run whenever passport. Authenticate method is called and returns different parameters defined in the .
passport.use(new GoogleStrategy({

  clientID: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  callbackURL: CALLBACK_URL

  },

  async function(accessToken, refreshToken, profile, email, cb) {

    return cb(null, email.id)

  }

))


// serving home page for the application
app.get('/', (req, res)=>

{
  //res.send("PAGINA HOME")
  res.sendFile(path.join(__dirname + '/public/index.html'))

})

// PAGINA SUCCESS - LOGIN OK
app.get('/success', (req, res)=>
{
  res.sendFile(path.join(__dirname + '/public/loginok.html'))
})

// user will be redirected to the google auth page whenever hits the ‘/google/auth’ route.
app.get('/google/auth',
  passport.authenticate('google', {scope: ['profile', 'email']})
)

// authentication failure redirection is defined in the following route
app.get('/auth/google/callback',
  passport.authenticate('google', {failureRedirect: '/'}),
  (req, res)=>
  {
    res.redirect('/success')
  }
)

// running server
app.listen(PORT, ()=>
{
  console.log("Server is running on Port " + PORT)
})