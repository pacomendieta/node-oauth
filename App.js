// importing required packages

const express= require('express');
const passport= require('passport')
const path= require('path')
const googleapi = require('./googleapikey') //clave de api y client id de Google
const GoogleStrategy= require('passport-google-oauth20').Strategy


var app= express()

// Express-Session 
const session = require('express-session');
app.use(session( {
  secret:['fsdfsdfsdafdscc11rr', 'kpjffsffas'],
  saveUninitialized: false,
  resave: false
}))

// DATOS DE LA APP REGISTRADOS EN GOOGLE DEVELOPPER CONSOLE
CLIENT_ID=googleapi.client_id
CLIENT_SECRET=googleapi.client_secret
CALLBACK_URL=googleapi.redirect_uris[0]




// configuring passport middleware
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser( function(user, done) {
  // ... aqui codigo a ejecutar cuando se autentica el usuario ...
  done(null, user)
})

passport.deserializeUser( function(user, done) {
   // ... aqui codigo a ejecutar cada nueva peticion tras autenticacion ...
  done(null, user)
})



//console.log("GOOGLE API:", googleapi)

// following middleware will run whenever passport. Authenticate method is called and returns different parameters defined in the .
passport.use(new GoogleStrategy({

  clientID: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  callbackURL: CALLBACK_URL

  },

  async function(accessToken, refreshToken, profile, email, cb) {
    var user = {
      accessToken: accessToken, 
      refreshToken: refreshToken, 
      profile: profile,
      email: email
  };
     return cb(null, user)
    //return cb(null, email.id)

  }

))




// serving home page for the application
app.get('/', (req, res)=>{
  res.render("index");  
  //res.sendFile(path.join(__dirname + '/public/index.html'))
})

// PAGINA SUCCESS - LOGIN OK
app.get('/success', (req, res)=>
{
  res.send(req.session.passport.user.email._json);
  //res.sendFile(path.join(__dirname + '/public/loginok.html'))
})

// user will be redirected to the google auth page whenever hits the ‘/google/auth’ route.
app.get('/google/auth',
  passport.authenticate('google', {
    //scope: ['profile', 'email','https://www.googleapis.com/auth/calendar']})
    scope: [
      'profile', 
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/calendar'
    ]
  })
)

//PAGINA DE CALLBACK
app.get('/auth/google/callback',
  passport.authenticate('google', {failureRedirect: '/'}),
  (req, res)=>
  {
    res.redirect('/success')
  }
)

// running server
app.listen(process.env.puerto, ()=>
{
  console.log("Server is running on Port " + process.env.puerto)
})
app.set('view engine', 'ejs');