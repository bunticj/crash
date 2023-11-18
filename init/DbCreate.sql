SET
    SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

START TRANSACTION;

SET
    time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS `crash_game` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

USE `crash_game`;

CREATE TABLE IF NOT EXISTS `user` (
    userId INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(32) NOT NULL,
    password TEXT NOT NULL,
    balance DOUBLE DEFAULT 0,
    win INT DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (userId),
    UNIQUE KEY (username)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `game_round` (
    roundId VARCHAR(32) NOT NULL,
    crashedOn DOUBLE DEFAULT NULL,
    multipliers TEXT DEFAULT NULL,
    winners TEXT DEFAULT NULL,
    durationMs INT DEFAULT NULL,
    createdAt TIMESTAMP DEFAULT NULL,
    PRIMARY KEY (roundId),
    UNIQUE KEY (roundId)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `bet_data` (
    ticketId INT NOT NULL AUTO_INCREMENT,
    roundId VARCHAR(32) NOT NULL,
    userId INT NOT NULL,
    betAmount DOUBLE,
    betWinAmount DOUBLE DEFAULT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (ticketId),
    FOREIGN KEY (roundId) REFERENCES `game_round`(roundId),
    FOREIGN KEY (userId) REFERENCES `user`(userId)
) ENGINE = InnoDB;