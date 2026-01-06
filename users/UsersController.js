const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");


router.get("/admin/", (req, res) => {
    User.find()
        .then(users => {
            res.render("admin/users/index", {
                users: users
            });
        })
        .catch(err => {
            console.error("Erro ao consultar Users: "+err);
            res.redirect("/")
        })
})

router.get("/admin/new", (req, res) => {
    res.render("./admin/users/new");
})

// DB
router.get("/admin/db", (req, res) => {
    User.find()
        .then(data => {
            res.send(data)
        })
})

////////// POST //////////
// Create
router.post("/admin/new", (req, res) => {
    const email = req.body.email;
    const pass = req.body.pass;

    //Validação: email duplicado
    User.findOne({ email: email })
        .then(data => {
            if(data == undefined || data == null || data == ""){ // Liberado para criação
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(pass, salt);

                new User({
                    email: email,
                    pass: hash
                }).save()
                    .then(() => {
                        console.log("User salvo no DB");
                        res.redirect("/")
                    })
                    .catch(err => {
                        console.error("Erro ao salvar user: "+err);
                        res.redirect("/")
                    })
            }else{
                console.error("Email já cadastrado!");
                res.redirect("/")
            }
        })
        .catch(err => {
            console.error("Erro ao consultar Users: "+err);
            res.redirect("/")
        })
})

module.exports = router