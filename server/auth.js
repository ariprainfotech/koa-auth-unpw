import passport from 'koa-passport'
import LocalStrategy from 'passport-local'

const strategy = new LocalStrategy(
    function (username, password, done) {
        console.log("login called username ", username)

        if (username == 'aripra' && password == 'aripra')
            return done(null, {username: 'Aripra', role: 'admin'})
        else
            return done(null, false, {message: 'Login failed'})
    }
)

passport.use(strategy);

// you can use this section to keep a smaller payload
passport.serializeUser(function (user, done) {
    console.log("serialize user")
    done(null, user)
})

passport.deserializeUser(function (user, done) {
    console.log("deserialize user")
    done(null, user)
})
