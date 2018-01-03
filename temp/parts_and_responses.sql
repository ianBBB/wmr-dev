-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 09, 2017 at 10:51 PM
-- Server version: 10.1.25-MariaDB
-- PHP Version: 5.6.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `wmr_dev`
--

-- --------------------------------------------------------

--
-- Structure for view `parts_and_responses`
--

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY INVOKER VIEW `parts_and_responses`  AS  
(select `part_config`.`ModuleID` AS `ModuleID`,`part_config`.`SectionNumber` AS `SectionNumber`,`part_config`.`QuestionNumber` AS `QuestionNumber`,`part_config`.`PartNumber` AS `PartNumber`,0 AS `CommentNumber`,`part_config`.`PartQuestion` AS `field1`,`part_config`.`Marks` AS `field2`,`part_config`.`StartWithFullMarks` AS `field3`,`part_config`.`PartNoteToMarker` AS `fields4` from `part_config`) 
union 
(select `part_config`.`ModuleID` AS `ModuleID`,`part_config`.`SectionNumber` AS `SectionNumber`,`part_config`.`QuestionNumber` AS `QuestionNumber`,`part_config`.`PartNumber` AS `PartNumber`,99 AS `CommentNumber`,`part_config`.`PartQuestion` AS `field1`,`part_config`.`Marks` AS `field2`,`part_config`.`StartWithFullMarks` AS `field3`,`part_config`.`PartNoteToMarker` AS `fields4` from `part_config`) ;

--
-- VIEW  `parts_and_responses`
-- Data: None
--

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
