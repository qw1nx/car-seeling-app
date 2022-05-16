const {Schema, model, Types: {ObjectId}} = require('mongoose');

const carSchema = new Schema({
     name: {type: String, required: true},
    description: {type: String, required: true, $lt: 500},
    imageUrl: {type: String, default: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png'},
    price: {type: Number, required: true, $gt: -1},
    accessories: {type: [ObjectId], default: [], ref: 'Accessory'},
    isDeleted: {type: Boolean, default: false},
    owner: {type: ObjectId, ref: 'User'}
});

const Car = model('Car', carSchema);

module.exports = Car;