import Koa from 'koa'
import Router from 'koa-router'
import koaBody from 'koa-body'
import views from 'koa-views'
import cookie from 'koa-cookie'
import staticCache from 'koa-static-cache'
import passport from 'koa-passport'
import koaSession from 'koa-session'
import noConfig from 'no-config'
import confFile from './config'
import co from 'co'

// Initializing configuration first and then starting application
co(async () => {
    let conf = await noConfig({config:confFile})
    let app = new Koa()
    app.use(cookie())
    app.use(koaBody({multipart: true, formidable: {keepExtensions: true}}))
    app.keys = ['A secret that no one knows']
    app.use(koaSession({}, app))

// authentication
    require('./auth')
    app.use(passport.initialize())
    app.use(passport.session())

// Mustache would be used as a template engine to render pages
    app.use(views(__dirname + '/views',
        {
            map: {
                html: 'mustache'
            },
            extension: 'mustache',
            debug: true,
            options: {
                partials: {
                    header: 'header'
                }
            }
        }
    ));

    app.use(function (ctx, next) {
        ctx.flash = function (type, msg) {
            ctx.session.flash = {type: type, message: msg};
        }

        return next();
    });

// Base router where everything would be added
    let baseRouter = new Router()

    baseRouter.get("/", async (ctx) => {
        if (ctx.session.flash && ctx.session.flash.message) {
            // clear message
            let msg = ctx.session.flash.message
            ctx.session.flash = undefined
            return ctx.render("login", {errorMsg: msg})
        }
        return ctx.render("login", {})
    })

    baseRouter.get('/logout', function (ctx) {
        ctx.logout()
        ctx.redirect('/')
    })


    baseRouter.post('/login', async (ctx, next) => {
            next()
        }, passport.authenticate('local', {
            successRedirect: '/app',
            failureRedirect: '/',
            failureFlash: true
        })
    )

    /**
     * All the URLs that follows this needs authentication to work
     */
    baseRouter.use(function (ctx, next) {
        if (ctx.isAuthenticated()) {
            return next()
        } else {
            ctx.redirect('/')
        }
    })

    baseRouter.get("/app", async (ctx) => {
        if (ctx.isAuthenticated())
            return ctx.render("app")
        else
            ctx.redirect("/")
    })

    app.use(baseRouter.routes())

    app.listen(conf.server.port, () => {
        console.log('Server started on ', conf.server.port)
    })
})