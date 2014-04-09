DROP TABLE IF EXISTS `earnerBadges`;
DROP TABLE IF EXISTS `badgeClasses`;
DROP TABLE IF EXISTS `issuerOrgs`;
DROP TABLE IF EXISTS `json`;
DROP TABLE IF EXISTS `earnerData`;
DROP TABLE IF EXISTS `earners`;

CREATE TABLE `earners` (
  `id` VARCHAR(255) NOT NULL,
  `createdOn` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) CHARACTER SET utf8
  ENGINE=InnoDB;

-- Backpack frontends can store any kind of arbitrary data for a
-- user. In the past we've solved this type of problem by sticking some
-- JSON into the database but that limits our ability to do performant
-- analysis –– we end up having to pull every row and do things in the
-- app rather than being able to take advantage of the SQL layer.
CREATE TABLE `earnerData` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `createdOn` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `earnerId` VARCHAR(255) NOT NULL,
  `key` VARCHAR(255) NOT NULL,
  `value` LONGTEXT,

  UNIQUE KEY (`earnerId`, `key`),
  FOREIGN KEY (`earnerId`)
    REFERENCES `earners`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  PRIMARY KEY (`id`)
) CHARACTER SET utf8
  ENGINE=InnoDB;

-- Speaking of sticking some JSON into the database, here's the table
-- where we cache the lookups of assertion, badge classes and issuer org
-- JSON. This will prevent us from making a lot of extra HTTP requests
-- when badges are coming from the same source. Storing the canonical
-- badge data will also make migrations easier if we decide to support
-- more of the badge properties.
CREATE TABLE `json` (
  `url` VARCHAR(255),
  `data` LONGTEXT NOT NULL,
  `updatedOn` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`url`)
) CHARACTER SET utf8
  ENGINE=InnoDB;

CREATE TABLE `issuerOrgs` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `createdOn` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `jsonUrl` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `url` VARCHAR(255) NOT NULL,
  `description` VARCHAR(255),
  `imageUrl` LONGTEXT,
  `email` VARCHAR(255),
  `revocationList` VARCHAR(255),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`jsonUrl`)
    REFERENCES `json`(`url`)
    ON UPDATE CASCADE
) CHARACTER SET utf8
  ENGINE=InnoDB;

CREATE TABLE `badgeClasses` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `createdOn` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `jsonUrl` VARCHAR(255) NOT NULL,
  `issuerOrgId` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `imageUrl` LONGTEXT NOT NULL,
  `criteriaUrl` VARCHAR(255) NOT NULL,
  `issuerJSONUrl` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`jsonUrl`)
    REFERENCES `json`(`url`)
    ON UPDATE CASCADE,
  FOREIGN KEY (`issuerOrgId`)
    REFERENCES `issuerOrgs`(`id`)
    ON UPDATE CASCADE
) CHARACTER SET utf8
  ENGINE=InnoDB;

-- AKA assertions
CREATE TABLE `earnerBadges` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `createdOn` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `jsonUrl` VARCHAR(255) NOT NULL,
  `earnerId` VARCHAR(255) NOT NULL,
  `badgeClassId` INT NOT NULL,
  `uid` VARCHAR(255) NOT NULL,
  `badgeJSONUrl` VARCHAR(255) NOT NULL,
  `evidenceUrl` VARCHAR(255),
  `imageUrl` LONGTEXT,
  `issuedOn` TIMESTAMP,
  `expires` TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`earnerId`)
    REFERENCES `earners`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (`jsonUrl`)
    REFERENCES `json`(`url`)
    ON UPDATE CASCADE,
  FOREIGN KEY (`badgeClassId`)
    REFERENCES `badgeClasses`(`id`)
    ON UPDATE CASCADE
) CHARACTER SET utf8
  ENGINE=InnoDB;
