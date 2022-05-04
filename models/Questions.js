const mongoose = require("mongoose")

const schema = mongoose.Schema({
    question: String,
    choix1: String,
    choix2: String,
    choix3: String,
    solution: String,
    good: String,
    bad: String
})

module.exports = mongoose.model("Questions", schema)
