const {Schema, model, Types: {ObjectId}} = require('mongoose');

const accessorySchema = new Schema({
    name: {type: String, required: true},
    description: {type: String},
    imageUrl: {type:String},
    price: {type: Number, min: 0},
    owner: {type: ObjectId, ref: 'User'}
});

const Accessory = model('Accessory', accessorySchema);

module.exports = Accessory;

