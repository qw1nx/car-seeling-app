const Car = require('../models/Car');
const {carViewModel} = require("./util.js");


async function getAll(query) {

    const options = {
        isDeleted: false
    };

    if (query.search) {
        options.name = new RegExp(query.search, 'i');
    }
    if (query.from) {
        options.price = {$gte: Number(query.form)};
    }
    if (query.to) {
        if (!options.price) {
            options.price = {};
        }
        options.price.$lte = Number(query.to);
    }

    const cars = await Car.find(options);
    return cars.map(carViewModel);
}

async function getById(id) {

    const car = await Car.findById(id).where({isDeleted: false}).populate('accessories');
    if (car) {
        return carViewModel(car);
    } else {
        return undefined;
    }

}

async function createCar(car) {
    const input = carViewModel(car);
    await Car.create(input);
}


async function deleteById(id, ownerId) {
    //await Car.findByIdAndDelete(id);
    const instance = await Car.findById(id).where({isDeleted: false});

    if (instance.owner != ownerId){
        return false;
    }

    await Car.findByIdAndUpdate(id, {isDeleted: true})
}

async function updateById(id, car, ownerId) {

    const instance = await Car.findById(id).where({isDeleted: false});

    if (instance.owner != ownerId){
        return false;
    }

    instance.name = car.name;
    instance.description = car.description;
    instance.imageUrl = car.imageUrl;
    instance.price = car.price;
    instance.accessories = car.accessories;

    await instance.save();
}

async function attachAccessory(carId, accessoryId, ownerId) {
    const instance = await Car.findById(carId);

    if(instance.owner != ownerId){
        console.log('User is not owner!');
        return false;
    }

    instance.accessories.push(accessoryId);
    await instance.save();
}

module.exports = () => (req, res, next) => {
    req.storage = {
        getAll,
        getById,
        createCar,
        updateById,
        deleteById,
        attachAccessory
    };
    next();
};