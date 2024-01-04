const express = require('express');
const morgan = require('morgan');
const exhbs = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const validator = require('express-validator');
const passport = require('passport');
const flash = require('connect-flash');
const MySQLStore = require('express-mysql-session')(session);

const { database } = require('./keys');

// Initializations 
const app = express();
require('./lib/passport');

// Settings 
/* process.evn.PORT: quiere decir que lo que sea que este 
   en la variable de entorno PORT, o 3000 si no hay nada
   allí 
*/
app.set('port', process.env.PORT || 3000);
// le dice a node que la carpeta views está en la carpeta src/public
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exhbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    // indica que los archivos terminaran en .hbs
    extname: 'hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', 'hbs');


//Middlewares
/*
    app.use utiliza el modulo morgan
    morgan necesita un parametro que 
    es un string, el cual mostrará un determinado
    mensaje por consola
*/
app.use(morgan('dev'));
app.use(session({
    secret: 'geospaciosmysql',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
  }));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(validator());

// Global variables
app.use((req, res, next) => {
    app.locals.message = req.flash('message');
    app.locals.success = req.flash('success');
    app.locals.adm = req.adm;
    app.locals.user = req.user;
    next();
  });

// Routes 
app.use(require('./routes')); // node automaticamente busca el archivo index.js
app.use(require('./routes/authentication'));
app.use('/admins', require('./routes/admins'));
app.use('/projects', require('./routes/projects'));

// Public
app.use(express.static(path.join(__dirname, 'public')));


// Starting the server 
app.listen(app.get('port'), ()=>{
    console.log('server on port', app.get('port'));
});
