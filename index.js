// [x] initialize and configure Express app
// [x] initialize templating lib
// [x] create home controller
// [x] bind routing
// [x] create layout
// create data service
// - [x] read all
// - [x] read one by Id
// - [x] create
// - [x] search
// - [x] edit
// - [x] delete
// implement controllers
// - [x] home (catalog)
// - [x] about
// - [x] details
// - [x] create
// - [x] improv ed home (search)
// - [x] edit
// - [x] delete
// [x] add front-end code

const express = require('express');
const hbs = require('express-handlebars');
const session = require('express-session');

const carsService = require('./services/cars');
const accessoryService = require('./services/accessory');
const authService = require('./services/auth');

const initDb = require('./models');

const { home } = require('./controllers/home');
const { about } = require('./controllers/about');
const create = require('./controllers/create');
const { details } = require('./controllers/details');
const edit = require('./controllers/edit');
const deleteCar = require('./controllers/delete');
const accessory = require('./controllers/accessory');
const attach = require('./controllers/attach');
const {registerGet, registerPost, loginGet, loginPost, logoutGet} = require('./controllers/auth');


const { notFound } = require('./controllers/notFound');
const {isLoggedIn} = require("./services/util");

const { body } = require('express-validator');

start();

async function start(){

    await initDb();
    const app = express();

    app.engine('hbs', hbs.create({
        extname: '.hbs'
    }).engine);
    app.set('view engine', 'hbs');


    app.use(session({
        secret: 'Albert tainichko e pedal',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: 'auto'}
    }));
    app.use(express.urlencoded({ extended: true }));
    app.use('/static', express.static('static'));
    app.use(carsService());
    app.use(accessoryService());
    app.use(authService());

    app.get('/', home);
    app.get('/about', about);
    app.get('/details/:id', details);

    app.route('/create')
        .get(isLoggedIn(), create.get)
        .post(isLoggedIn(), create.post);

    app.route('/delete/:id')
        .get(isLoggedIn(),deleteCar.get)
        .post(isLoggedIn(),deleteCar.post);

    app.route('/edit/:id')
        .get(isLoggedIn(),edit.get)
        .post(isLoggedIn(),edit.post);

    app.route('/accessory')
        .get(isLoggedIn(),accessory.get)
        .post(isLoggedIn(),accessory.post);

    app.route('/attach/:id')
        .get(isLoggedIn(),attach.get)
        .post(isLoggedIn(),attach.post);

    app.route('/register')
        .get(registerGet)
        .post(
            body('username')
                .isLength({min: 3}).withMessage('Password too short')
                .isAlphanumeric().withMessage('Only letters and numbers can be used.'),
            body('password')
                .notEmpty().withMessage('Password is required')
                .isLength({min: 8}).withMessage('Minimum length of password is 8 symbols'),
            body('repeatPassword')
                .custom(async(value, {req}) => {
                    if (value != req.body.password){
                        throw new Error('Password dont\' match!')
                    }
                }).withMessage('Password dont\' match!'),
            registerPost);

    app.route('/login')
        .get(loginGet)
        .post(loginPost)

    app.get('/ logout', isLoggedIn(),logoutGet);

    app.all('*', notFound);

    app.listen(3000, () => console.log('Server started on port 3000'));
}
