module.exports = function navLinks(req, res, next) {
    // locals
    
    if (req.session.currentUser) {
        res.locals.routes = [
            { href: "/gallery/new", title: "New Post" },
            { href: "/logout", title: "Logout" },
        ];
    } else {
        res.locals.routes = [
            { href: "/login", title: "Login" },
            { href: "/register", title: "Register" },
        ];
    }
    /*
    res.locals.routes = [
        { href: "/login", title: "Login" },
        { href: "/register", title: "Register" },
        { href: "/gallery/new", title: "New Post" },
    ];
    */
    next();
};