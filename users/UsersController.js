const express = require("express");
const router = express.Router();
const adminAuth = require("../middlewares/adminAuth");
const bcrypt = require("bcryptjs");
const User = require("./User");

// Login
router.get("/login", (req, res) => {
    res.render("./admin/users/login");
})

// Logout
router.get("/logout", (req, res) => {
    req.session.user = undefined;
    res.redirect("/");
})

// Create
router.get("/admin/new", adminAuth, (req, res) => {
    res.render("./admin/users/new");
})

router.get("/admin/", adminAuth, (req, res) => {
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

// DB
router.get("/admin/db", adminAuth, (req, res) => {
    User.find()
        .then(data => {
            res.send(data)
        })
})

////////// POST //////////

// authenticate 
router.post("/authenticate", (req, res) => {
    const email = req.body.email;
    const pass = req.body.pass;

    // Consulta DB
    User.findOne({ email: email })
        .then(user => {
            if(user != undefined && user != null && user != ""){ // Existe o usuário
                // Validar senha
                var correct = bcrypt.compareSync(pass, user.pass);
                if(correct){ // Senha correta
                    req.session.user = {
                        id: user._id,
                        email: user.email
                    }
                    res.redirect("/");
                }else{
                    res.redirect("/users/login");
                }
            }else{
                res.redirect("/users/login");
            }
        })
        .catch(error => {
            console.error("Erro ao consultar user: "+error);
            res.redirect("/");
        })
})

// Create
router.post("/admin/new", adminAuth, (req, res) => {
    const nick = req.body.nick;
    const email = req.body.email;
    const pass = req.body.pass;

    //Validação: email duplicado
    User.findOne({ email: email })
        .then(data => {
            if(data == undefined || data == null || data == ""){ // Liberado para criação
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(pass, salt);

                new User({
                    nick: nick,
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

// Delete
router.post("/admin/delete", adminAuth, (req, res) => {
    const id = req.body.id;

    // Validação
    if(id != undefined && id != null && id != ""){
        // Deletando usuário
        User.deleteOne({ _id: id })
            .then(data => {
                console.log("User deletado com sucesso!");
                res.redirect("/users/admin");
            })
            .catch(error => {
                console.error("Erro ao deletar user: "+error);
                res.redirect("/");
            })
    }else{
        console.log("User não encontrado");
        res.redirect('/');
    }
})

module.exports = router
