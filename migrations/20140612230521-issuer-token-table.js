var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.runSql(
    'CREATE TABLE `issuerTokens` ('
    + '  `id` INT NOT NULL AUTO_INCREMENT,'
    + '  `name` VARCHAR(255) NOT NULL,'
    + '  `key` VARCHAR(255) NOT NULL,'
    + '  `token` VARCHAR(255) NOT NULL,'
    + '  PRIMARY KEY (`id`),'
    + '  UNIQUE KEY (`name`),'
    + '  UNIQUE KEY (`key`)'
    + ') CHARACTER SET utf8'
    + '  ENGINE=InnoDB', callback)
};

exports.down = function(db, callback) {
  db.runSql('DROP TABLE `issuerTokens`', callback);
};
