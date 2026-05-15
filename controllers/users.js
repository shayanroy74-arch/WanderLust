const User = require("../models/user.js");

module.exports.renderSignupForm = (req,res)=>{

    res.render("./users/signup.ejs");
};

module.exports.signup = async(req,res)=>{
    try{ 
        let {username, email, password} = req.body;
        const newUser = new User({username, email});
        const registeredUser = await User.register(newUser, password);
        req.flash("success", "Welcome to Wanderlust!");
        
        req.login(registeredUser, (err)=>{
            if(err){
                return next(err);
            }            
            req.flash("success", "Welcome to Wanderlust!");
            if(res.locals.redirectUrl){
        res.redirect(res.locals.redirectUrl);
    }else{
        res.redirect("/listings");
    }
        });
    }catch(error){
        req.flash("error", error.message);
        return res.redirect("/signup");
    };
};

module.exports.renderLoginForm = (req,res)=>{
    res.render("./users/login.ejs");
};

module.exports.login = async(req,res,next)=>{
    req.flash("success", "Welcome back!");
    if(res.locals.redirectUrl){
        res.redirect(res.locals.redirectUrl);
    }else{
        res.redirect("/listings");
    }
    
   
};

module.exports.logout = (req,res)=>{
    req.logout((err)=>{
    if(err){            
        return next(err);
    }
    req.flash("success", "Logged you out!");
    res.redirect("/listings");
});
};