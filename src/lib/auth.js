module.exports = {
    isLoggedInUser (req, res, next) {
        if (req.user && req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/signinUser');
    },
    isLoggedInAdmin (req, res, next) {
        if (req.adm && req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/signinAdm');
    }
};