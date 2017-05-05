"use strict"

const express   = require("express");
const mongodb   = require('mongodb');
const URL       = 'mongodb://127.0.0.1:27017/netologyHomework10';


let users;

mongodb.MongoClient.connect(URL, (err, db) => {
    if (err) return console.error('Cannt connect to db, error:', error);
    users = db.collection('users');
});

const app = module.exports = express();

app.get('/', function(req, res) {
    const regex = { $regex: new RegExp(req.query.find, 'g') };
    var filter = (req.query.find) ? {$or: [{name: regex}, {surname: regex}, {phone: regex}]} : {};
    users.find(filter).toArray((err, result) => {
        send(res, err, result);
    });
});

app.post('/', function(req, res) {
    if (req.body && req.body.surname && req.body.name && req.body.phone){
        users.insert(req.body, (err, result) => {
            send(res, err, result.ops[0]);
        });
    }else {
        send(res, new Error("require params not present"));
    }
});

app.get('/:id', function(req, res) {
    users.findOne({_id: new mongodb.ObjectId(req.params.id)}, (err, result) => {
        send(res, err, result);
    });
});

app.put('/:id', function(req, res) {
    if (req.body && req.params.id &&
            req.body.surname && req.body.name && req.body.phone){

        const id = new mongodb.ObjectId(req.params.id);
        delete req.body.id;

        users.update({ _id: id }, req.body, (err, result) => {
            send(res, err, result);
        });
    }else {
        send(res, new Error("require params not present"));
    }
});

app.delete('/:id', function(req, res) {
    users.findAndRemove({ _id: new mongodb.ObjectID(req.params.id) }, (err, result) => {
        send(res, err, result);
    });
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