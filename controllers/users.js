const User=require("../models/user");

module.exports.renderSignupForm=(req, res) => {
    res.render("users/signup");
};
module.exports.signup=async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);

        // Auto login after signup
        req.login(registeredUser, (err) => {
            if (err) return next(err);

            req.flash("success", "Welcome to WanderNest!");

            // ✅ redirect to returnTo or listings
            const redirectUrl = req.session.returnTo || "/listings";
            delete req.session.returnTo;

            res.redirect(redirectUrl);
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};
module.exports.renderLoginForm=(req, res) => {res.render("users/login");}

module.exports.loginForm= async(req, res) => {
    req.flash("success", "Welcome back to WanderNest!");
    let redirectUrl=res.locals.redirectUrl||"/listings"
    res.redirect(redirectUrl);
}

module.exports.logout=(req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out");
        res.redirect("/listings");
    });
};