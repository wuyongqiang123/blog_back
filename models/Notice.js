/**
 * Created by mac on 17/4/10.
 */
var mongoose = require('mongoose');
var noticeSchema = require('../schemas/admin/notice');

module.exports = mongoose.model('Notice', noticeSchema);