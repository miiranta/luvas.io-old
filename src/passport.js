const url               = require('url');
const chalk             = require("chalk")
const jwt               = require("jsonwebtoken")
const os                = require("os")
const passport          = require('passport')
const GoogleStrategy    = require('passport-google-oauth20').Strategy;
const FacebookStrategy  = require('passport-facebook').Strategy;
const User              = require("./db/models/users")
const getProfilePic     = require("./utils/profile/getProfilePicture")

passport.serializeUser( async function(user, done) {

    try{

        const token = jwt.sign({_id: user._id.toString()},process.env.JWT_SECRET, {expiresIn:'10 days'})

        user.tokens = user.tokens.concat({token, machine: os.hostname(), os: os.type() + os.release()})
        await user.save()

        done(null, token)

    }catch{
      console.log(chalk.magenta.bold("[Session] ") + chalk.red("Could not create cookie!")) 
      done(null, false, { message: 'Bad Session' })
    }
    

  });
  
passport.deserializeUser( async function(token, done) {

    try{

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findOne({_id: decoded, "tokens.token": token})

        if(!user){throw new Error()}

        done(null, {...user.toObject(), token})

    }catch{
      console.log(chalk.magenta.bold("[Session] ") + chalk.red("Could not verify token!")) 

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

    const googleId = profile.id
    const email    = profile.emails[0].value
    const name     = profile.displayName

    try{

    const userDb = await User.findOne({email})

    const dataPic = await getProfilePic(profile.photos[0].value)
    
        if(!userDb){
          const user = await User.create({googleId, email, name, admin: 0, profilePic: dataPic, nick: Date.now().toString(16)})
          console.log(chalk.magenta.bold("[Session] ") + chalk.green("Created new user: ") + chalk.blue(email + " (Google)")) 
          return cb(null, user)
        }

        await User.updateOne({email},{googleId, email, name})
        console.log(chalk.magenta.bold("[Session] ") + chalk.green("Login: ") + chalk.blue(email + " (Google)")) 
        return cb(null, userDb)
 
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

const picLink = profile.photos[0].value
const email = profile.emails[0].value
const name = profile.displayName
const facebookId = profile.id

try{

const userDb = await User.findOne({email})

const dataPic = await getProfilePic(picLink)

        if(!userDb){
          const user = await User.create({facebookId, email, name, admin: 0, profilePic: dataPic, nick: Date.now().toString(16)})
          console.log(chalk.magenta.bold("[Session] ") + chalk.green("Created new user: ") + chalk.blue(email + " (Facebook)")) 
          return cb(null, user)
        }

        await User.updateOne({email},{facebookId, email, name})
        console.log(chalk.magenta.bold("[Session] ") + chalk.green("Login: ") + chalk.blue(email + " (Facebook)")) 
        return cb(null, userDb)

}catch(e){
  cb(null, false, { message: 'Bad Session' })}

}
));
//----------------------------------------------------