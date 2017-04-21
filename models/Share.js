/**
 * Created by mac on 17/4/11.
 */
var mongoose = require('mongoose');
var shareSchema = require('../schemas/admin/share');

module.exports = mongoose.model('Share', shareSchema);