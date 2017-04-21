/**
 * Created by mac on 17/4/5.
 */
var mongoose = require('mongoose');
var articlelistSchema = require('../schemas/admin/articlelist');

module.exports = mongoose.model('Articlelist', articlelistSchema);