-- phpMyAdmin SQL Dump
-- version 2.11.6
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Apr 25, 2019 at 02:02 PM
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
-- Table structure for table `admin`
--

CREATE TABLE `pet_admin` (
  `username` varchar(20) NOT NULL,
  `password` varchar(20) NOT NULL,
  `mobile` bigint(20) NOT NULL,
  `utype` varchar(20) NOT NULL,
  `otp` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `admin`
--

INSERT INTO `pet_admin` (`username`, `password`, `mobile`, `utype`, `otp`) VALUES
('admin', 'admin', 0, 'Admin', ''),
('officer', '1234', 9976570006, 'Officer', '6211');

-- --------------------------------------------------------

--
-- Table structure for table `apply`
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
-- Dumping data for table `apply`
--

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE `pet_feedback` (
  `id` int(11) NOT NULL,
  `uname` varchar(20) NOT NULL,
  `comment` varchar(100) NOT NULL,
  `rdate` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `feedback`
--


-- --------------------------------------------------------

--
-- Table structure for table `register`
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
-- Dumping data for table `register`
--

