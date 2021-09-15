module.exports = function navLinks(req, res, next) {
    // locals
    
    if (req.session.currentUser) {
        res.locals.routes = [
            { href: "/gallery", title: "Gallery"},
            { href: "/gallery/feed", title: "Feed"},
            { href: "/gallery/museum/1", title: "Museum"},
            { href: "/conversation", title: "Conversations" },
            { href: "/users/cart", title: "Cart" },
            { href: "/users/purchases", title: "Purchases" },
            { href: "/users/sales", title: "Sales" },
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