const express = require('express');
const router = express.Router();
const passport = require('passport');

const pool = require('../database');

router.get('/add', (req, res)=>{
    res.render('../views/admins/add');
});

// router.post('/add', passport.authenticate('local.signup',{
//     successRedirect: '/add',
//     failureRedirect: '/add',
//     failureFlash: true
// }));

module.exports = router;