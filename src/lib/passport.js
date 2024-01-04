// con modulo passport y passport local podemos hacer nuestras autenticaciones
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('../lib/helpers');

//Estrategia de login de usuarios
passport.use('local.signinUser', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, username, password, done)=>{
    console.log(req.body);
    const rows = await pool.query('SELECT * FROM usuario WHERE username = ?', [username]);
    if(rows.length > 0){
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password);
        if(validPassword){
            done(null, user, req.flash('success', 'Bienvenido, ' + user.username));
        }else{
            done(null, false, req.flash('message', 'Contraseña incorrecta'));
        }
    }else{
        return done(null, false, req.flash('message', 'Ops... El nombre de usuario no existe'));
    }
}));

//Estrategia de registro de usuarios
passport.use('local.signupUser', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, username, password, done) => {
  
    //const { fullname } = req.body;
    const { org_name } = req.body;
    const { email } = req.body;
    let newUser = {
      //fullname,
      username,
      password,
      org_name,
      email
    };
    newUser.password = await helpers.encryptPassword(password);
    // Saving in the Database
    const result = await pool.query('INSERT INTO usuario SET ? ', newUser);
    newUser.cod_user = result.insertId;
    return done(null, newUser);
  }));

// Ingreso de admins
passport.use('local.signinAdm', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, username, password, done)=>{
    console.log(req.body);
    const rows = await pool.query('SELECT * FROM adm WHERE username = ?', [username]);
    if(rows.length > 0){
        const adm = rows[0];
        console.log(adm);
        const validPassword = await helpers.matchPassword(password, adm.password);
        if(validPassword){
            done(null, adm, req.flash('success', 'Bienvenido, ' + adm.username));
        }else{
            done(null, false, req.flash('message', 'Contraseña incorrecta'));
        }
    }else{
        return done(null, false, req.flash('message', 'Ops... El nombre de usuario no existe'));
    }
}));

/*passport.use('local.signupAdm', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback:  true
}, async (req, username, password, done) =>{
    const { fullname } = req.body;
    const newAdmin = {
        username,
        password,
        fullname,
        masteradm: true,
        state: true
    };
    newAdmin.password = await helpers.encryptPassword(password);
    const result = await pool.query('INSERT INTO adm SET ?', [newAdmin]);
    newAdmin.id = result.insertId;
    return done(null, newAdmin);
}));*/

//Sesión serializada de usuarios
passport.serializeUser((user, done)=>{
    done(null, user.cod_user);
});

//Sesión deserializada de usuarios
passport.deserializeUser(async (cod_user, done)=>{
    const rows = await pool.query('SELECT * FROM usuario WHERE cod_user = ?', [cod_user]);
    done(null, rows[0]);
});

//Sesión serializada de admins
passport.serializeUser((adm, done)=>{
    done(null, adm.cod_admin);
});

//Sesión deserializada de admins
passport.deserializeUser(async (cod_admin, done)=>{
    const rows = await pool.query('SELECT * FROM adm WHERE cod_admin = ?', [cod_admin]);
    done(null, rows[0]);
});