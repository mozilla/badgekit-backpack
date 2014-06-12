var dbm = require('db-migrate');
var async = require('async');

var createTables = [
  'CREATE TABLE `earners` ('
  + '  `id` VARCHAR(255) NOT NULL,'
  + '   `createdOn` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,'
  + '   PRIMARY KEY (`id`)'
  + ') CHARACTER SET utf8'
  + '  ENGINE=InnoDB',

  'CREATE TABLE `earnerData` ('
  + '  `id` INT NOT NULL AUTO_INCREMENT,'
  + '  `createdOn` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,'
  + '  `earnerId` VARCHAR(255) NOT NULL,'
  + '  `key` VARCHAR(255) NOT NULL,'
  + '  `value` LONGTEXT,'
  + ''
  + '  UNIQUE KEY (`earnerId`, `key`),'
  + '  FOREIGN KEY (`earnerId`)'
  + '    REFERENCES `earners`(`id`)'
  + '    ON DELETE CASCADE'
  + '    ON UPDATE CASCADE,'
  + '  PRIMARY KEY (`id`)'
  + ') CHARACTER SET utf8'
  + '  ENGINE=InnoDB',

  'CREATE TABLE `json` ('
  + '  `url` VARCHAR(255),'
  + '  `data` LONGTEXT NOT NULL,'
  + '  `updatedOn` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,'
  + '  PRIMARY KEY (`url`)'
  + ') CHARACTER SET utf8'
  + '  ENGINE=InnoDB',

  'CREATE TABLE `issuerOrgs` ('
  + '  `id` INT NOT NULL AUTO_INCREMENT,'
  + '  `createdOn` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,'
  + '  `jsonUrl` VARCHAR(255) NOT NULL,'
  + '  `name` VARCHAR(255) NOT NULL,'
  + '  `url` VARCHAR(255) NOT NULL,'
  + '  `description` VARCHAR(255),'
  + '  `imageUrl` LONGTEXT,'
  + '  `email` VARCHAR(255),'
  + '  `revocationList` VARCHAR(255),'
  + '  PRIMARY KEY (`id`),'
  + '  UNIQUE KEY (`jsonUrl`),'
  + '  FOREIGN KEY (`jsonUrl`)'
  + '    REFERENCES `json`(`url`)'
  + '    ON UPDATE CASCADE'
  + ') CHARACTER SET utf8'
  + '  ENGINE=InnoDB',

  'CREATE TABLE `badgeClasses` ('
  + '  `id` INT NOT NULL AUTO_INCREMENT,'
  + '  `createdOn` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,'
  + '  `jsonUrl` VARCHAR(255) NOT NULL,'
  + '  `issuerOrgId` INT NOT NULL,'
  + '  `name` VARCHAR(255) NOT NULL,'
  + '  `description` VARCHAR(255) NOT NULL,'
  + '  `imageUrl` LONGTEXT NOT NULL,'
  + '  `criteriaUrl` VARCHAR(255) NOT NULL,'
  + '  `issuerJSONUrl` VARCHAR(255) NOT NULL,'
  + '  PRIMARY KEY (`id`),'
  + '  UNIQUE KEY (`jsonUrl`),'
  + '  FOREIGN KEY (`jsonUrl`)'
  + '    REFERENCES `json`(`url`)'
  + '    ON UPDATE CASCADE,'
  + '  FOREIGN KEY (`issuerOrgId`)'
  + '    REFERENCES `issuerOrgs`(`id`)'
  + '    ON UPDATE CASCADE'
  + ') CHARACTER SET utf8'
  + '  ENGINE=InnoDB',

  'CREATE TABLE `earnerBadges` ('
  + '  `id` INT NOT NULL AUTO_INCREMENT,'
  + '  `createdOn` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,'
  + '  `jsonUrl` VARCHAR(255) NOT NULL,'
  + '  `earnerId` VARCHAR(255) NOT NULL,'
  + '  `badgeClassId` INT NOT NULL,'
  + '  `uid` VARCHAR(255) NOT NULL,'
  + '  `badgeJSONUrl` VARCHAR(255) NOT NULL,'
  + '  `evidenceUrl` VARCHAR(255),'
  + '  `imageUrl` LONGTEXT,'
  + '  `issuedOn` TIMESTAMP,'
  + '  `expires` TIMESTAMP,'
  + '  PRIMARY KEY (`id`),'
  + '  UNIQUE KEY (`jsonUrl`),'
  + '  FOREIGN KEY (`earnerId`)'
  + '    REFERENCES `earners`(`id`)'
  + '    ON DELETE CASCADE'
  + '    ON UPDATE CASCADE,'
  + '  FOREIGN KEY (`jsonUrl`)'
  + '    REFERENCES `json`(`url`)'
  + '    ON UPDATE CASCADE,'
  + '  FOREIGN KEY (`badgeClassId`)'
  + '    REFERENCES `badgeClasses`(`id`)'
  + '    ON UPDATE CASCADE'
  + ') CHARACTER SET utf8'
  + '  ENGINE=InnoDB',

  'CREATE TABLE `evidence` ('
  + '  `id` INT NOT NULL AUTO_INCREMENT,'
  + '  `earnerId` VARCHAR(255) NOT NULL,'
  + '  `createdOn` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,'
  + '  `slug` VARCHAR(128) NOT NULL,'
  + '  `description` VARCHAR(255),'
  + '  `content` MEDIUMTEXT NOT NULL,'
  + '  `contentType` VARCHAR(255) NOT NULL DEFAULT "text/plain",'
  + '  PRIMARY KEY (`id`),'
  + '  UNIQUE KEY (`slug`),'
  + '  FOREIGN KEY (`earnerId`)'
  + '    REFERENCES `earners`(`id`)'
  + '    ON DELETE CASCADE'
  + '    ON UPDATE CASCADE'
  + ') CHARACTER SET utf8'
  + '  ENGINE=InnoDB',
];

var dropTables = [
  'DROP TABLE IF EXISTS `evidence`',
  'DROP TABLE IF EXISTS `earnerBadges`',
  'DROP TABLE IF EXISTS `badgeClasses`',
  'DROP TABLE IF EXISTS `issuerOrgs`',
  'DROP TABLE IF EXISTS `json`',
  'DROP TABLE IF EXISTS `earnerData`',
  'DROP TABLE IF EXISTS `earners`',
];

exports.up = function (db, callback) {
  async.series(createTables.map(function (tableSql) {
    return db.runSql.bind(db, tableSql)
  }), callback)
};

exports.down = function (db, callback) {
  async.series(dropTables.map(function (tableSql) {
    return db.runSql.bind(db, tableSql)
  }), callback)
};
