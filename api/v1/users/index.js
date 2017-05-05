"use strict"

const express   = require("express");
const Users     = require("../../../model/users");
const User      = require("../../../model/user");

let users  = new Users();

const app = module.exports = express();

app.get('/', function(req, res) {
    users.findAll((err, users) => {
        send(res, err, users);
    });
});

app.post('/', function(req, res) {
    let usr = new User(req.body.surname, req.body.name, req.body.phone);
    users.add(usr, (err, user) => {
        send(res, err, user);
    });
});

app.get('/:id', function(req, res) {
    users.findById(req.params.id, (err, user) => {
        send(res, err, user);
    });
});

app.put('/:id', function(req, res) {
    users.findById(req.params.id, (err, user) => {
        if (err)
            return send(res, err);

        user.surname = req.body.surname;
        user.name = req.body.name;
        user.phone = req.body.phone;
        users.save(user, (err, user) => {
            send(res, err, user);
        });
    });
});

app.delete('/:id', function(req, res) {
    users.remove(req.params.id, (err, user) => {
        send(res, err, user);
    })
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('500 Internal error - ' + err.message);
});

const send = (res, err, data) => {
    if (err)
        return res.status(400).send(err.message);

    res.status(200).json(data);
}