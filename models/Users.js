const mongoose = require("mongoose");

const schema = mongoose.Schema({
    username: {type:String,
        required: true,
        index: {
            unique: true,
        }},

    email: {
        type:String,
        required: true,
        index: {
            unique: true,
        },},
    password: {
        type:String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    },
    ingame: Boolean,
    inventory: {
        cannettes: Number,
        bouteillesverre: Number,
        aliments: Number,
        plastiques: Number,
        cigarettes: Number,
        carton: Number
    },
    chapter: Number,
});

module.exports = mongoose.model("Users", schema);
