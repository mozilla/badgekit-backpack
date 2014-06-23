var dbm = require('db-migrate');
var async = require('async');

exports.up = function(db, callback) {
  async.mapSeries([
    'CREATE TABLE `badgeImages` ('
    + '  `id` INT NOT NULL AUTO_INCREMENT,'
    + '  `slug` VARCHAR(255) NOT NULL,'
    + '  `contentType` VARCHAR(255) NOT NULL,'
    + '  `data` LONGBLOB NOT NULL,'
    + '  PRIMARY KEY (`id`),'
    + '  UNIQUE KEY (`slug`)'
    + ') CHARACTER SET utf8'
    + '  ENGINE=InnoDB',

    'ALTER TABLE `earnerBadges`'
    + '  ADD COLUMN `badgeImageSlug` VARCHAR(255)',

    'ALTER TABLE `earnerBadges`'
    + '  ADD CONSTRAINT `badgeImageFk`'
    + '  FOREIGN KEY (`badgeImageSlug`)'
    + '  REFERENCES `badgeImages`(`slug`)'
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
