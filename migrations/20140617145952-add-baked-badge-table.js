var dbm = require('db-migrate');
var async = require('async');

exports.up = function(db, callback) {
  async.mapSeries([
    'CREATE TABLE `badgeImages` ('
    + '  `id` INT NOT NULL AUTO_INCREMENT,'
    + '  `contentType` VARCHAR(255) NOT NULL,'
    + '  `data` LONGBLOB NOT NULL,'
    + '  PRIMARY KEY (`id`)'
    + ') CHARACTER SET binary'
    + '  ENGINE=InnoDB',

    'ALTER TABLE `earnerBadges`'
    + '  ADD COLUMN `badgeImageId` INT',

    'ALTER TABLE `earnerBadges`'
    + '  ADD CONSTRAINT `badgeImageFk`'
    + '  FOREIGN KEY (`badgeImageId`)'
    + '  REFERENCES `badgeImages`(`id`)'
    + '  ON DELETE CASCADE'
    + '  ON UPDATE CASCADE'
  ], db.runSql.bind(db), callback);
};

exports.down = function(db, callback) {
  async.mapSeries([
    // Confusingly, DROP FOREIGN KEY requires the constraint name, not
    // the name of the foreign key.
    'ALTER TABLE `earnerBadges` DROP FOREIGN KEY `badgeImageFk`',
    'ALTER TABLE `earnerBadges` DROP COLUMN `badgeImageId`',
    'DROP TABLE `badgeImages`'
  ], db.runSql.bind(db), callback);
};
