//Requires
var passport        = require('passport')
var GoogleStrategy  = require('passport-google-oauth20').Strategy;
FacebookStrategy    = require('passport-facebook').Strategy;
var url             = require('url');
const User          = require("./db/models/users")
const chalk         = require("chalk")
const jwt           = require("jsonwebtoken")
const os            = require("os")
const getProfilePic = require("./utils/getProfilePicture")


//Get "user" Passed from strategy CREATE COOKIE
passport.serializeUser( async function(user, done) {

    try{

        //Generate JWT
        const token = jwt.sign({_id: user._id.toString()},process.env.JWT_SECRET, {expiresIn:'10 days'})

        //Concat JWT in database
        user.tokens = user.tokens.concat({token, machine: os.hostname(), os: os.type() + os.release()})
        await user.save()

        //Pass token to cookie
        done(null, token)

    }catch{
      console.log(chalk.magenta.bold("[Session] ") + chalk.red("Could not create cookie!")) 
    done(null, false, { message: 'Bad Session' })
    }
    

  });
  
//Get id from cookie and find user in db READ COOKIE
passport.deserializeUser( async function(token, done) {

    try{

        //JWT valid?
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        //Find user in Db
        const user = await User.findOne({_id: decoded, "tokens.token": token})

        //Not found
        if(!user){throw new Error()}

        //Generate req.user
        done(null, {...user.toObject(), token})

    }catch{
      console.log(chalk.magenta.bold("[Session] ") + chalk.red("Could not verify token!")) 

      //req.user = false (undefined)
      done(null, false, { message: 'Bad Session' })
    }


});


//---------------Start Google strategy----------------
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.URL+"/auth/google/redirect"
  },
  async (accessToken, refreshToken, profile, cb) => {

    //Successfull login: Register GoogleId in DB
    const googleId = profile.id
    const email    = profile.emails[0].value
    const name     = profile.displayName

    try{
    
    //User exists?
    const userDb = await User.findOne({email})

    //Get Profile Picture
    const dataPic = await getProfilePic(profile.photos[0].value)
    
    
        //No > Create
        if(!userDb){
          const user = await User.create({googleId, email, name, admin: 0, profilePic: dataPic, nick: Date.now().toString(16)})
          console.log(chalk.magenta.bold("[Session] ") + chalk.green("Created new user: ") + chalk.blue(email + " (Google)")) 
          return cb(null, user)
        }
        
        //Yes > Update and Continue
        await User.updateOne({email},{googleId, email, name})
        console.log(chalk.magenta.bold("[Session] ") + chalk.green("Login: ") + chalk.blue(email + " (Google)")) 
        return cb(null, userDb)

    //Error   
    }catch(e){cb(null, false, { message: 'Bad Session' })}


  }
));
//----------------------------------------------------

//---------------Start Facebook strategy--------------
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.URL+"/auth/facebook/redirect",
  profileFields: ['id', 'email', 'name', 'displayName','picture.type(large)']
},
async (accessToken, refreshToken, profile, cb) => {
  
//Success > Get info from profile
const picLink = profile.photos[0].value
const email = profile.emails[0].value
const name = profile.displayName
const facebookId = profile.id

try{

//User in DB?
const userDb = await User.findOne({email})

//Get profile pic
const dataPic = await getProfilePic(picLink)

        //No > Create
        if(!userDb){
          const user = await User.create({facebookId, email, name, admin: 0, profilePic: dataPic, nick: Date.now().toString(16)})
          console.log(chalk.magenta.bold("[Session] ") + chalk.green("Created new user: ") + chalk.blue(email + " (Facebook)")) 
          return cb(null, user)
        }

        //Yes > Update and Continue
        await User.updateOne({email},{facebookId, email, name})
        console.log(chalk.magenta.bold("[Session] ") + chalk.green("Login: ") + chalk.blue(email + " (Facebook)")) 
        return cb(null, userDb)


//Error
}catch(e){
  cb(null, false, { message: 'Bad Session' })}

}
));
//----------------------------------------------------