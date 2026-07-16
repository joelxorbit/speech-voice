-- phpMyAdmin SQL Dump
-- version 2.11.6
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Apr 13, 2021 at 07:14 AM
-- Server version: 5.0.51
-- PHP Version: 5.2.6

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `petition`
--

-- --------------------------------------------------------

--
-- Table structure for table `pet_admin`
--

CREATE TABLE `pet_admin` (
  `username` varchar(20) NOT NULL,
  `password` varchar(20) NOT NULL,
  `mobile` bigint(20) NOT NULL,
  `utype` varchar(20) NOT NULL,
  `otp` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `pet_admin`
--

INSERT INTO `pet_admin` (`username`, `password`, `mobile`, `utype`, `otp`) VALUES
('admin', 'admin', 0, 'Admin', ''),
('officer', '1234', 9790530960, 'Officer', '6211');

-- --------------------------------------------------------

--
-- Table structure for table `pet_apply`
--

CREATE TABLE `pet_apply` (
  `id` int(11) NOT NULL,
  `uname` varchar(20) NOT NULL,
  `name` varchar(20) NOT NULL,
  `gender` varchar(10) NOT NULL,
  `dob` varchar(15) NOT NULL,
  `address` varchar(50) NOT NULL,
  `area` varchar(30) NOT NULL,
  `taluk` varchar(20) NOT NULL,
  `state` varchar(20) NOT NULL,
  `district` varchar(20) NOT NULL,
  `pincode` varchar(20) NOT NULL,
  `contact` bigint(20) NOT NULL,
  `aadhar` varchar(30) NOT NULL,
  `email` varchar(40) NOT NULL,
  `dept` varchar(20) NOT NULL,
  `complaint` text NOT NULL,
  `ptype` varchar(20) NOT NULL,
  `process` varchar(20) NOT NULL,
  `status` int(11) NOT NULL,
  `rdate` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `pet_apply`
--

INSERT INTO `pet_apply` (`id`, `uname`, `name`, `gender`, `dob`, `address`, `area`, `taluk`, `state`, `district`, `pincode`, `contact`, `aadhar`, `email`, `dept`, `complaint`, `ptype`, `process`, `status`, `rdate`) VALUES
(1, 'U1', 'tajudeen', 'Male', '1-2-2000', 'ewr', 'Tiruverumbur', 'Ariyamangalam', 'Tamilnadu', 'Namakkal', '620003', 9874561230, '1354 5468 6587', 't@gmail.com', 'Road', 'dfgff', 'New Petition', 'Completed', 2, '24-03-2021');

-- --------------------------------------------------------

--
-- Table structure for table `pet_feedback`
--

CREATE TABLE `pet_feedback` (
  `id` int(11) NOT NULL,
  `uname` varchar(20) NOT NULL,
  `comment` varchar(100) NOT NULL,
  `rdate` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `pet_feedback`
--


-- --------------------------------------------------------

--
-- Table structure for table `pet_register`
--

CREATE TABLE `pet_register` (
  `id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `gender` varchar(10) NOT NULL,
  `dob` varchar(15) NOT NULL,
  `address` varchar(50) NOT NULL,
  `area` varchar(30) NOT NULL,
  `taluk` varchar(20) NOT NULL,
  `state` varchar(20) NOT NULL,
  `district` varchar(20) NOT NULL,
  `pincode` varchar(20) NOT NULL,
  `contact` bigint(20) NOT NULL,
  `aadhar` varchar(30) NOT NULL,
  `email` varchar(40) NOT NULL,
  `otp` varchar(20) NOT NULL,
  `sms_st` int(11) NOT NULL,
  `uname` varchar(20) NOT NULL,
  `pass` varchar(20) NOT NULL,
  UNIQUE KEY `contact` (`contact`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `pet_register`
--

INSERT INTO `pet_register` (`id`, `name`, `gender`, `dob`, `address`, `area`, `taluk`, `state`, `district`, `pincode`, `contact`, `aadhar`, `email`, `otp`, `sms_st`, `uname`, `pass`) VALUES
(1, 'tajudeen', 'Male', '10-03-2021', 'trwt', 'Tiruverumbur', 'Ariyamangalam', 'Tamilnadu', 'Tanjore', '620003', 9790530960, '6547 6575 5877', 't@gmail.com', '2387', 0, 'U1', '');
