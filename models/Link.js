/**
 * Created by mac on 17/4/5.
 */
var mongoose = require('mongoose');
var linkSchema = require('../schemas/admin/link');

module.exports = mongoose.model('Link', linkSchema);