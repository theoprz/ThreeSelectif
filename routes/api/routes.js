const express = require("express");
const router = express.Router();
const Users = require("../../models/Users.js");
const Questions = require("../../models/Questions.js");
const axios = require("axios");

router.get("/users", async (req, res) => {
    const users = await Users.find();
    res.send(users);
});

router.get("/users/:username", async (req, res) => {
    const users = await Users.find({ username: req.params.username });
    res.send(users);
});

router.put("/users/update/:username", function(req, res) {
    Users.findOne({ username: req.params.username }, async function(err, foundObject){
        if(err){
            console.log(err);
            res.status(500).send();
        }else{
            if(!foundObject){
                res.status(404).send();
            }else{
                let test = Object.assign(foundObject.inventory, req.body);
                console.log(test);
                foundObject.inventory = test;
                foundObject.save();
            }
        }
    })
});

router.put("/users/update/chapter/:username", function(req, res) {
    Users.findOne({ username: req.params.username }, async function(err, foundObject){
        if(err){
            console.log(err);
            res.status(500).send();
        }else{
            if(!foundObject){
                res.status(404).send();
            }else{
                const obj = JSON.parse(JSON.stringify(req.body));
                foundObject.chapter = obj.chapter;
                foundObject.save();
            }
        }
    })
});

router.put("/users/update/newFinalScore/:username", function(req, res) {
    Users.findOne({ username: req.params.username }, async function(err, foundObject){
        if(err){
            console.log(err);
            res.status(500).send();
        }else{
            if(!foundObject){
                res.status(404).send();
            }else{
                const obj = JSON.parse(JSON.stringify(req.body));
                if(foundObject.score.bestScore){
                    if(foundObject.score.bestScore < obj.finalScore){
                        foundObject.score.bestScore = obj.finalScore;
                        foundObject.score.bestScoreDate = Date.now();
                    }
                    foundObject.score.lastScore = obj.finalScore;
                }else{
                    foundObject.score.bestScore = obj.finalScore;
                    foundObject.score.lastScore = obj.finalScore;
                    foundObject.score.bestScoreDate = Date.now();
                }

                foundObject.save();
            }
        }
    })
});

router.get("/questions", async (req, res) => {
    const questions = await Questions.find();
    res.send(questions);
});

router.post("/questions", async (req, res) => {
    const question = new Questions({
        question: "Quel est le d??chet qui se d??grade le moins vite ?",
        choix1: "Verre",
        choix2: "Plastique",
        choix3: "Aluminium",
        solution: "1",
        good: "Bonne r??ponse, il faut 4000 ans pour que le verre soit d??grad?? dans la nature",
        bad: "Mauvaise r??ponse: le verre se d??grade en 4000 ans alors que les autres ..."
    });
    await question.save();
    res.send(question)
});

module.exports = router;
