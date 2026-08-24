const User = require('../models/user.js');
const { UserSchema } = require("../schema.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
}

// module.exports.signup = async (req, res) => {
//     try{
//         let{ email, username, password } = req.body;
//     const newUser = new User({ email, username });
//     const registeredUser = await User.register(newUser, password);
//     console.log(registeredUser);
//     req.login(registeredUser, err => {
//         if (err) {
//             return next(err);
//         }
//         req.flash('success', 'Welcome to Wanderlust!');
//         res.redirect('/listings');
//     });
   
//     } catch(e){
//         req.flash("error", e.message);
//         res.redirect('/signup');
//     }
// }
module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;

        // Password requirements
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!passwordRegex.test(password)) {
            req.flash(
                "error",
                "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
            );

            return res.redirect("/signup");
        }

        const newUser = new User({
            email,
            username
        });

        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }

            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) =>{
    res.render("users/login.ejs");
}

module.exports.login = async(req, res) =>{
    req.flash("success", "Welcome back to Wanderlust");
    res.redirect(res.locals.redirectUrl || '/listings');
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "You are logged out");
        res.redirect('/listings');
    })
}