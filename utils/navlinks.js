module.exports = function navLinks(req, res, next) {
    
    if (req.session.currentUser) {
        res.locals.routes = [
            { href: "/gallery", title: "Gallery", tooltip: "View all artwork"},
            { href: "/gallery/feed", title: "Feed", tooltip: "View only posts from users you are following"},
            { href: "/gallery/museum/1", title: "Museum", tooltip: "View artwork that you can't interact with"},
            { href: "/conversation", title: "Conversations",tooltip:"View your messages" },
            { href: "/users/cart", title: "Cart", tooltip:"View your shopping cart" },
            { href: "/users/purchases", title: "Purchases",tooltip:"View your purchases" },
            { href: "/users/sales", title: "Sales",tooltip:"View your sales" },
            { href: "/gallery/new", title: "New Post",tooltip:"Make a new post" },
            { href: "/logout", title: "Logout",tooltip:"Please come back soon" },
        ];
    } else {
        res.locals.routes = [
            { href: "/login", title: "Login", tooltip:"Login to an account" },
            { href: "/register", title: "Register", tooltip:"Sign up for an account" },
        ];
    }
    next();
};