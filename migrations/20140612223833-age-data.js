var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.runSql(
    'ALTER TABLE `earners` '
    + 'ADD `under13` BOOLEAN', callback)
};

exports.down = function(db, callback) {
  db.runSql(
    'ALTER TABLE `earners`'
    + ' DROP COLUMN `under13`', callback)
};
