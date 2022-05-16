const {Schema, model} = require('mongoose');
const {comparePass, hashPassword} = require('../services/util');

const userSchema = new Schema({
    username: {type: String, required: true, minlength: 3},
    hashedPassword: {type: String, required: true}
});

userSchema.methods.comparePassword = async function(password){
    //Use bcrypt to hash and compare incoming password with stores hashed password
    return await comparePass(password, this.hashedPassword);
}

userSchema.methods.hashPwd = async function(password){
    return await hashPassword(password);
}

userSchema.pre('save', async function (next){
    console.log('Saving..')
    if (this.isModified('hashedPassword')){
        console.log('Hashing pw');
        this.hashedPassword = await hashPassword(this.hashedPassword);
    }

    next();
})

const User = model('User', userSchema);

module.exports = User;