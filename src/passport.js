//Requires
var passport        = require('passport')
var GoogleStrategy  = require('passport-google-oauth20').Strategy;
var url             = require('url');
var request         = require('axios')
const User          = require("./db/models/users")
const chalk         = require("chalk")
const jwt           = require("jsonwebtoken")
const os            = require("os")


//Get "user" Passed from strategy CREATE COOKIE
passport.serializeUser( async function(user, done) {

    try{

        //Generate JWT
        const token = jwt.sign({_id: user._id.toString()},process.env.JWT_SECRET, {expiresIn:'10 days'})

        //Concat JWT in database
        user.tokens = user.tokens.concat({token, machine: os.hostname(), os: os.type() + " " + os.release()})
        await user.save()

        //Pass token to cookie
        done(null, token)

    }catch{
      console.log(chalk.red("Could not create cookie!"))
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
      console.log(chalk.red("Could not verify login for token!"))

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
    const userDb = await User.findOne({googleId})

    //Get Profile Picture
    if(profile.photos[0].value){
    const image = await request.get(profile.photos[0].value, {responseType: 'arraybuffer'});
    var dataPic = "data:image/png;base64, " + Buffer.from(image.data).toString('base64');
    }else{
    dataPic = "/img/profile.png"
    }
    
    
        //No > Create
        if(!userDb){
          const user = await User.create({googleId, email, name, profilePic: dataPic, nick: name})

          console.log(chalk.yellow("Created and logged new user (google): ") + chalk.blue(user.name))
          return cb(null, user)
        }
    
        //Yes > Update and Continue
        await User.updateOne({googleId},{googleId, email, name, profilePic: dataPic})
        console.log(chalk.yellow("Logged user (google): ") + chalk.blue(userDb.name))
        return cb(null, userDb)


    }catch(e){cb(null, false, { message: 'Bad Session' })}


  }
));
//----------------------------------------------------