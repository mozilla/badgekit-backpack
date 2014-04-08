-- Is there any other mandatory data that should go along with earners?
DROP TABLE IF EXISTS `earners`;
CREATE TABLE `earners` (
  `id` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
) CHARACTER SET utf8
  ENGINE=InnoDB;

-- Backpack frontends can store any kind of arbitrary data for a
-- user. In the past we've solved this type of problem by sticking some
-- JSON into the database but that limits our ability to do performant
-- analysis –– we end up having to pull every row and do things in the
-- app rather than being able to take advantage of the SQL layer.
DROP TABLE IF EXISTS `earnerData`;
CREATE TABLE `earnerData` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `earnerId` INT NOT NULL REFERENCES `earners`(`id`),
  `key` VARCHAR(255) NOT NULL,
  `value` LONGBLOB,
  UNIQUE KEY `earner_and_key` (`earnerId`, `key`),
  PRIMARY KEY (`id`)
) CHARACTER SET utf8
  ENGINE=InnoDB;

-- Speaking of sticking some JSON into the database, here's the table
-- where we cache the lookups of assertion, badge classes and issuer org
-- JSON. This will prevent us from making a lot of extra HTTP requests
-- when badges are coming from the same source. Storing the canonical
-- badge data will also make migrations easier if we decide to support
-- more of the badge properties.
DROP TABLE IF EXISTS `json`;
CREATE TABLE `json` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `data` LONGTEXT NOT NULL,
  `url` TEXT,
  `updatedOn` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) CHARACTER SET utf8
  ENGINE=InnoDB;

-- AKA assertions
DROP TABLE IF EXISTS `earnerBadges`;
CREATE TABLE `earnerBadges` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `jsonId` INT NOT NULL REFERENCES `json`(`id`),
  `earnerId` INT NOT NULL REFERENCES `earners`(`id`),
  `badgeClassId` INT NOT NULL REFERENCES `badgeClasses`(`id`),
  `uid` VARCHAR(255) NOT NULL,
  `badgeUrl` TEXT NOT NULL,
  `evidenceUrl` TEXT,
  `issuedOn` TIMESTAMP,
  `expires` TIMESTAMP,
  PRIMARY KEY (`id`)
) CHARACTER SET utf8
  ENGINE=InnoDB;

DROP TABLE IF EXISTS `badgeClasses`;
CREATE TABLE `badgeClasses` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `jsonId` INT NOT NULL REFERENCES `json`(`id`),
  `issuerOrgId` INT NOT NULL REFERENCES `issuerOrgs`(`id`),
  `name` VARCHAR(255) NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `image` LONGTEXT NOT NULL,
  `criteria` VARCHAR(255) NOT NULL,
  `issuer` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
) CHARACTER SET utf8
  ENGINE=InnoDB;

DROP TABLE IF EXISTS `issuerOrgs`;
CREATE TABLE `issuerOrgs` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `jsonId` INT NOT NULL REFERENCES `json`(`id`),
  `name` VARCHAR(255) NOT NULL,
  `url` TEXT,
  `description` VARCHAR(255),
  `image` LONGTEXT,
  `email` VARCHAR(255),
  `revocationList` TEXT,
  PRIMARY KEY (`id`)
) CHARACTER SET utf8
  ENGINE=InnoDB;
