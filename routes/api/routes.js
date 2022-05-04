const express = require("express");
const router = express.Router();
const Users = require("../../models/users");
const Questions = require("../../models/questions");
const axios = require("axios");

router.get("/users", async (req, res) => {
    const users = await Users.find();
    res.send(users);
});

router.post("/users", async (req, res) => {
    const user = new Users({
        username: "Test",
        chapter: 0,
    });
    await user.save();
    res.send(user)
});

router.get("/users/:username", async (req, res) => {
    const users = await Users.find({ username: req.params.username });
    res.send(users);
});

router.get("/questions", async (req, res) => {
    const questions = await Questions.find();
    res.send(questions);
});

router.post("/questions", async (req, res) => {
    const question = new Questions({
        question: "Quel est le déchet qui se dégrade le moins vite ?",
        choix1: "Verre",
        choix2: "Plastique",
        choix3: "Aluminium",
        solution: "1",
        good: "Bonne réponse, il faut 4000 ans pour que le verre soit dégradé dans la nature",
        bad: "Mauvaise réponse: le verre se dégrade en 4000 ans alors que les autres ..."
    });
    await question.save();
    res.send(question)
});

module.exports = router;
