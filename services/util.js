const bcrypt = require('bcrypt');

function accessoryViewModel(accessory) {
    return {
        id: accessory._id,
        name: accessory.name,
        description: accessory.description,
        imageUrl: accessory.imageUrl,
        price: accessory.price,
        owner: accessory.owner
    }
}

function carViewModel(c) {

    const model = {
            id: c._id,
            name: c.name,
            description: c.description,
            imageUrl: c.imageUrl,
            price: c.price,
            accessories: c.accessories,
            owner: c.owner
        }

    if (model.accessories.length > 0 && model.accessories[0].name){
        model.accessories = model.accessories.map(accessoryViewModel);
    }
    return model;
}

async function hashPassword (password){
    return bcrypt.hash(password, 10);
}

async function comparePass (password, hashedPassword){
    return bcrypt.compare(password, hashedPassword);
}

function isLoggedIn(){
    return function(req, res, next){
        if (req.session.user){
            next();
        } else {
            res.redirect('/login')
        }
    }
}

module.exports = {
    accessoryViewModel,
    carViewModel,
    hashPassword,
    comparePass,
    isLoggedIn
}