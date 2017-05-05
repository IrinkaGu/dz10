"use strict";

class Users extends Array{

    constructor() {
        super();
        this.nextId = 1;
    }

    add(user, callback){
        if (user && user.surname && user.name && user.phone){
            user.id = this.nextId++;
            this.push(user);
            callback(null, user);
        }else{
            callback(new Error("require params not present"));
        }
    }

    save(user, callback){
        if (user && user.surname && user.name && user.score){
            let usr = this._findByIdSync(user.id);
            if (usr){
                Object.assign(usr, user);
                callback(null, usr);
            }else{
                add(user, callback);
            }
        }else{
            callback(new Error("require params not present"));
        }
    }

    findAll(callback, offset, limit, fields){
        if (offset)
            offset = 0;
        let filter = (limit) ? this.slice(offset, parseInt(offset) + parseInt(limit))
            : this.slice(offset)
        if (fields){
            let result = new Users();
            filter.forEach((user) => {
                let usr = Object.assign({}, user);
                Object.keys(usr).forEach((key) => {
                    if (!fields.includes(key)) delete usr[key];
                });
                result.push(usr);
            });
            return callback(null, result);
        }
        callback(null, filter);
    }

    findById(id, callback){
        let usr = this._findByIdSync(id);
        if (usr)
            callback(null, usr);
        else
            callback(new Error('User not found'));
    }

    _findByIdSync(id){
        return this.find((user) => user.id == id);
    }

    remove(id, callback){
        let usr = this._findByIdSync(id);
        if (usr){
            var index = this.indexOf(usr);
            let user = this.splice(index, 1);
            callback(null, user[0]);
        }else{
            callback(new Error('User not found'));
        }
    }

    removeAll(callback){
        callback(null, this.splice(0, this.length));
    }

}

module.exports = Users;