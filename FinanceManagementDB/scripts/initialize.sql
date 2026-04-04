CREATE TABLE IF NOT EXISTS FinanceManagementDB.UpgradeScripts (
  Name VARCHAR(255) NOT NULL,
  CONSTRAINT PK_Name UNIQUE (Name)
);

DROP PROCEDURE IF EXISTS initialize;

DELIMITER $$
CREATE PROCEDURE initialize()
BEGIN
	IF ((SELECT 1 FROM FinanceManagementDB.UpgradeScripts WHERE Name = 'Initialize.sql' LIMIT 1) IS NULL) THEN

		CREATE TABLE IF NOT EXISTS FinanceManagementDB.Bills (
		  Id INTEGER NOT NULL AUTO_INCREMENT,
		  Name VARCHAR(255) NOT NULL,
		  SourceId INTEGER NOT NULL,
		  Date DATETIME,
		  DatePayed DATETIME,
		  Amount DECIMAL(10,2),
		  PRIMARY KEY (Id)
		);

		CREATE TABLE IF NOT EXISTS FinanceManagementDB.Gifts (
		  Id INTEGER NOT NULL AUTO_INCREMENT,
		  Name VARCHAR(255),
		  Amount DECIMAL(10,2),
		  Type INTEGER NOT NULL,
		  PRIMARY KEY (Id)
		);

		CREATE TABLE IF NOT EXISTS FinanceManagementDB.Receipts (
		  Id INTEGER NOT NULL AUTO_INCREMENT,
		  SourceId INTEGER NOT NULL,
		  Date DATETIME,
		  Amount DECIMAL(10,2),
		  PRIMARY KEY (Id)
		);

		CREATE TABLE IF NOT EXISTS FinanceManagementDB.Sources (
		  Id INTEGER NOT NULL AUTO_INCREMENT,
		  Name VARCHAR(255),
		  Type INTEGER NOT NULL,
		  PRIMARY KEY (Id)
		);

		CREATE TABLE IF NOT EXISTS FinanceManagementDB.MonthSummaries (
		  Id INTEGER NOT NULL AUTO_INCREMENT,
		  Year INTEGER NOT NULL,
		  Month INTEGER NOT NULL,
		  Rent DECIMAL(10,2) NOT NULL,
		  Food DECIMAL(10,2) NOT NULL,
		  NonFood DECIMAL(10,2) NOT NULL,
		  Utilities DECIMAL(10,2) NOT NULL,
		  Total DECIMAL(10,2) NOT NULL,
		  PRIMARY KEY (Id)
		);

		-- register upgrade script
		INSERT INTO FinanceManagementDB.UpgradeScripts (Name) VALUES ('Initialize.sql');

	END IF;
END $$

DELIMITER ;

call initialize();