const express = require('express');
const router = express.Router();
const pool = require('../database');

const passport = require('passport');
const { isLoggedInUser } = require('../lib/auth');
const { isLoggedInAdmin } = require('../lib/auth');

//const passport = require('passport');
//const { isLoggedIn } = require('../lib/auth');

// Vista de registro de un nuevo usuario
router.get('/signupUser', (req, res) => {
    res.render('../views/authentication/signupUser');
  });

//Ingreso de datos de usuario y validaciones para el registro
router.post('/signupUser', (req, res, next) => {
    req.check('username')
    .notEmpty().withMessage('Nombre de usuario requerido')
    .not().matches(/\W/).withMessage('Sólo se permiten números, letras y guión bajo para el nombre de usuario')
    /*.custom(async value => {
      const User = await pool.query('SELECT * FROM usuario WHERE username = ?', [value]);
      if(!User) {
        return value;
      }
    }).withMessage('User already exists');*/
    req.check('password')
    .notEmpty().withMessage('Contraseña requerida')
    .not().matches(/\W/).withMessage('Sólo se permiten números, letras y guión bajo bajo para la contraseña');
    req.check('checkpass', 'Se requiere confirmación de la contraseña').notEmpty();
    req.check('password', "La confirmación de la contraseña es incorrecta").custom(value => {
      if (value == req.body.checkpass) {
        return value;
      }
    });
    req.check('org_name', 'Se requiere agregar la organización a la que pertenece').notEmpty();
    req.check('email')
    .notEmpty().withMessage('Se requiere el correo electrónico')
    .isEmail().withMessage('Correo electrónico inválido');
    const errors = req.validationErrors();
    if (errors.length > 0) {
      req.flash('message', errors[0].msg);
      res.redirect('/signupUser');
    }  
    console.log(req.body);

    passport.authenticate('local.signupUser', {
    successRedirect: '/userProfile',
    failureRedirect: '/signupUser',
    failureFlash: true
  })(req, res, next);
  });

// Vista de inicio de sesión Usuarios
router.get('/signinUser', (req, res) => {
    res.render('../views/authentication/signinUser');
  });

// Inicio de sesión usuarios
router.post('/signinUser', (req, res, next) => {
  req.check('username', 'Nombre de usuario requerido').notEmpty();
  req.check('password', 'Contraseña requerida').notEmpty();
  const errors = req.validationErrors();
  if (errors.length > 0) {
    req.flash('message', errors[0].msg);
    res.redirect('/signinUser');
  }
  console.log(req.body);
  passport.authenticate('local.signinUser', {
    successRedirect: '/userProfile',
    failureRedirect: '/signinUser',
    failureFlash: true
  })(req, res, next);
});

// Inicio de sesión Administrador
router.get('/signinAdm', (req, res) => {
    res.render('../views/authentication/signinAdm');
  });

router.post('/signinAdm', (req, res, next) => {
  req.check('username', 'Nombre de administrador requerido').notEmpty();
  req.check('password', 'Contraseña requerida').notEmpty();
  const errors = req.validationErrors();
  if (errors.length > 0) {
    req.flash('message', errors[0].msg);
    res.redirect('/signinAdm');
  }
  console.log(req.body);
  passport.authenticate('local.signinAdm', {
    successRedirect: '/admProfile',
    failureRedirect: '/signinAdm',
    failureFlash: true
  })(req, res, next);
});

//Cierra la sesión del usuario desde '/logoutUser'
router.get('/logoutUser', (req, res) => {
  req.logOut();
  res.redirect('/');
});

router.get('/userProfile', isLoggedInUser, (req, res) => {
  req.session.user = req.user;
  res.render('userProfile');
});

//Cierra la sesión del usuario desde '/logoutUser'
router.get('/logoutUser', (req, res) => {
  req.logOut();
  res.redirect('/');
});

router.get('/admProfile', isLoggedInAdmin, (req, res) => {
  req.session.user = req.adm;
  res.render('admProfile');
});



  module.exports = router;