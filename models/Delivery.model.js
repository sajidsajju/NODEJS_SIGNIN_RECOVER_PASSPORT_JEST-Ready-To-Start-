const mongoose = require('mongoose');
const crypto = require('crypto');

const deliverySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 4,
        max: 255
    },
    email: {
        type: String,
        required: true,
        min: 10,
        max: 255
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    type: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        required: false
    },
    addresses: [{
        address : {
            phone:{
                type: Number,
                required: false
            },
            flat: {
                type: String,
                required: false
            },
            landmark: {
                type: String,
                required: false
            }
        }
    }],
    resetPasswordToken: {
        type: String,
        required: false
    },

    resetPasswordExpires: {
        type: Date,
        required: false
    }
}, {timestamps: true});

deliverySchema.methods.generatePasswordReset = function() {
    this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};

mongoose.set('useFindAndModify', false);

module.exports = mongoose.model('Delivery', deliverySchema);