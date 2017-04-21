/**
 * Created by mac on 17/4/5.
 */
var mongoose = require('mongoose');
var usersSchema = require('../schemas/main/users');

module.exports = mongoose.model('User', usersSchema);