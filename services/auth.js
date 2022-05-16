const User = require('../models/User');

// testUpdate();
//
// async function testUpdate(){
//     const user = await User.findOne({});
//     user.hashedPassword = '123324'
//     console.log(user);
// }

 function logout(session){
 delete session.user;
}

async function register(session, username, password) {
    const user = new User({
        username,
        hashedPassword: password
    });
    console.log(user);
    await user.save();
    session.user = {
        id: user._id,
        username: user.username
    }
}

async function login(session, username, password) {
    const user = await User.findOne({username});
    if (user && await user.comparePassword(password)) {
        session.user = {
            id: user._id,
            username: user.username
        }
        return true;
    } else {
        throw new Error('Incorrect username or password');
    }
}

// async function hashPassword(password){
//
// }

module.exports = () => (req, res, next) => {
    if (req.session.user){
        res.locals.user = req.session.user;
        res.locals.hasUser = true;
    }

    req.auth = {
        register: (...params) => register(req.session, ...params),
        login: (...params) => login(req.session, ...params),
        logout: () => logout(req.session)
    };
    next();
};