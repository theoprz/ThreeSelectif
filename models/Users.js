const mongoose = require("mongoose")

const schema = mongoose.Schema({
    username: String,
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
})

module.exports = mongoose.model("Users", schema)
