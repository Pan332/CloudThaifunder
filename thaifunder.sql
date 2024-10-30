-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 30, 2024 at 10:52 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `thaifunder`
--

-- --------------------------------------------------------

--
-- Table structure for table `address`
--

CREATE TABLE `address` (
  `profile_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `postcode` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `address`
--

INSERT INTO `address` (`profile_id`, `user_id`, `address`, `city`, `postcode`) VALUES
(1, 101, '1234', 'Bnagkok', '10120');

-- --------------------------------------------------------

--
-- Table structure for table `audits`
--

CREATE TABLE `audits` (
  `audit_id` int(11) NOT NULL,
  `campaign_id` int(11) NOT NULL,
  `audit_document_url` varchar(255) NOT NULL,
  `audit_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `badges`
--

CREATE TABLE `badges` (
  `badge_id` int(11) NOT NULL,
  `badge_name` varchar(255) NOT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `campaigncategories`
--

CREATE TABLE `campaigncategories` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `campaigncategorymapping`
--

CREATE TABLE `campaigncategorymapping` (
  `campaign_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `campaigns`
--

CREATE TABLE `campaigns` (
  `campaign_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `goal_amount` decimal(10,2) NOT NULL,
  `raised_amount` decimal(10,2) DEFAULT 0.00,
  `created_by` int(11) NOT NULL,
  `status` enum('pending','verified','completed') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `comment_id` int(11) NOT NULL,
  `campaign_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `comment_text` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `donations`
--

CREATE TABLE `donations` (
  `donation_id` int(11) NOT NULL,
  `campaign_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `donation_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `payment_id` int(11) NOT NULL,
  `donation_id` int(11) NOT NULL,
  `payment_method` enum('credit_card','bank_transfer','paypal') NOT NULL,
  `payment_status` enum('pending','completed','failed') NOT NULL,
  `payment_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `report_id` int(11) NOT NULL,
  `campaign_id` int(11) NOT NULL,
  `document_url` varchar(255) NOT NULL,
  `approved_by` int(11) DEFAULT NULL,
  `report_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `userbadges`
--

CREATE TABLE `userbadges` (
  `user_id` int(11) NOT NULL,
  `badge_id` int(11) NOT NULL,
  `earned_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('user','admin','validator','fundraiser') DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `phone` varchar(15) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password_hash`, `role`, `created_at`, `phone`, `first_name`, `last_name`) VALUES
(1, 'user1', 'user1@example.com', '0', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(2, 'user2', 'user2@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(3, 'user3', 'user3@example.com', '0', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(4, 'user4', 'user4@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(5, 'user5', 'user5@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(6, 'user6', 'user6@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(7, 'user7', 'user7@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(8, 'user8', 'user8@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(9, 'user9', 'user9@example.com', '0', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(10, 'user10', 'user10@example.com', '0', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(11, 'user11', 'user11@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(12, 'user12', 'user12@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(13, 'user13', 'user13@example.com', '0', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(14, 'user14', 'user14@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(15, 'user15', 'user15@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(16, 'user16', 'user16@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(17, 'user17', 'user17@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(18, 'user18', 'user18@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(19, 'user19', 'user19@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(20, 'user20', 'user20@example.com', '0', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(21, 'user21', 'user21@example.com', '0', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(22, 'user22', 'user22@example.com', '0', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(23, 'user23', 'user23@example.com', '0', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(24, 'user24', 'user24@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(25, 'user25', 'user25@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(26, 'user26', 'user26@example.com', '0', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(27, 'user27', 'user27@example.com', '0', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(28, 'user28', 'user28@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(29, 'user29', 'user29@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(30, 'user30', 'user30@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(31, 'user31', 'user31@example.com', '0', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(32, 'user32', 'user32@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(33, 'user33', 'user33@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(34, 'user34', 'user34@example.com', '0', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(35, 'user35', 'user35@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(36, 'user36', 'user36@example.com', '0', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(37, 'user37', 'user37@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(38, 'user38', 'user38@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(39, 'user39', 'user39@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(40, 'user40', 'user40@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(41, 'user41', 'user41@example.com', '0', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(42, 'user42', 'user42@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(43, 'user43', 'user43@example.com', '0', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(44, 'user44', 'user44@example.com', '0', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(45, 'user45', 'user45@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(46, 'user46', 'user46@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(47, 'user47', 'user47@example.com', '0', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(48, 'user48', 'user48@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(49, 'user49', 'user49@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(50, 'user50', 'user50@example.com', '0', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(51, 'user51', 'user51@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(52, 'user52', 'user52@example.com', '0', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(53, 'user53', 'user53@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(54, 'user54', 'user54@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(55, 'user55', 'user55@example.com', '0', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(56, 'user56', 'user56@example.com', '0', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(57, 'user57', 'user57@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(58, 'user58', 'user58@example.com', '0', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(59, 'user59', 'user59@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(60, 'user60', 'user60@example.com', '0', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(61, 'user61', 'user61@example.com', '0', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(62, 'user62', 'user62@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(63, 'user63', 'user63@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(64, 'user64', 'user64@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(65, 'user65', 'user65@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(66, 'user66', 'user66@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(67, 'user67', 'user67@example.com', '0', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(68, 'user68', 'user68@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(69, 'user69', 'user69@example.com', '0', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(70, 'user70', 'user70@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(71, 'user71', 'user71@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(72, 'user72', 'user72@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(73, 'user73', 'user73@example.com', '0', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(74, 'user74', 'user74@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(75, 'user75', 'user75@example.com', '0', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(76, 'user76', 'user76@example.com', '0', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(77, 'user77', 'user77@example.com', '0', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(78, 'user78', 'user78@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(79, 'user79', 'user79@example.com', '0', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(80, 'user80', 'user80@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(81, 'user81', 'user81@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(82, 'user82', 'user82@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(83, 'user83', 'user83@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(84, 'user84', 'user84@example.com', '0', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(85, 'user85', 'user85@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(86, 'user86', 'user86@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(87, 'user87', 'user87@example.com', '0', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(88, 'user88', 'user88@example.com', '0', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(89, 'user89', 'user89@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(90, 'user90', 'user90@example.com', '0', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(91, 'user91', 'user91@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(92, 'user92', 'user92@example.com', '0', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(93, 'user93', 'user93@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(94, 'user94', 'user94@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(95, 'user95', 'user95@example.com', '0', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(96, 'user96', 'user96@example.com', '0', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(97, 'user97', 'user97@example.com', '0', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(98, 'user98', 'user98@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(99, 'user99', 'user99@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(100, 'user100', 'user100@example.com', '1', 'user', '2024-10-27 16:33:15', NULL, NULL, NULL),
(101, 'user', 'thunter_12@hotmail.com', '$2a$10$Z4RrEJtFuDZLlfqwGR2WDOySOPwtuZNvX4IPJzTALKgGudACQOOeC', 'user', '2024-10-27 19:09:11', '0922487902', 'Panuwat', 'Korkiatthamrong');

-- --------------------------------------------------------

--
-- Table structure for table `verifications`
--

CREATE TABLE `verifications` (
  `verification_id` int(11) NOT NULL,
  `campaign_id` int(11) NOT NULL,
  `verifier_id` int(11) NOT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `verified_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `address`
--
ALTER TABLE `address`
  ADD PRIMARY KEY (`profile_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `audits`
--
ALTER TABLE `audits`
  ADD PRIMARY KEY (`audit_id`),
  ADD KEY `campaign_id` (`campaign_id`);

--
-- Indexes for table `badges`
--
ALTER TABLE `badges`
  ADD PRIMARY KEY (`badge_id`),
  ADD UNIQUE KEY `badge_name` (`badge_name`);

--
-- Indexes for table `campaigncategories`
--
ALTER TABLE `campaigncategories`
  ADD PRIMARY KEY (`category_id`),
  ADD UNIQUE KEY `category_name` (`category_name`);

--
-- Indexes for table `campaigncategorymapping`
--
ALTER TABLE `campaigncategorymapping`
  ADD PRIMARY KEY (`campaign_id`,`category_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `campaigns`
--
ALTER TABLE `campaigns`
  ADD PRIMARY KEY (`campaign_id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`comment_id`),
  ADD KEY `campaign_id` (`campaign_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `donations`
--
ALTER TABLE `donations`
  ADD PRIMARY KEY (`donation_id`),
  ADD KEY `campaign_id` (`campaign_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `donation_id` (`donation_id`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`report_id`),
  ADD KEY `campaign_id` (`campaign_id`),
  ADD KEY `approved_by` (`approved_by`);

--
-- Indexes for table `userbadges`
--
ALTER TABLE `userbadges`
  ADD PRIMARY KEY (`user_id`,`badge_id`),
  ADD KEY `badge_id` (`badge_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `verifications`
--
ALTER TABLE `verifications`
  ADD PRIMARY KEY (`verification_id`),
  ADD KEY `campaign_id` (`campaign_id`),
  ADD KEY `verifier_id` (`verifier_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `address`
--
ALTER TABLE `address`
  MODIFY `profile_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `audits`
--
ALTER TABLE `audits`
  MODIFY `audit_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `badges`
--
ALTER TABLE `badges`
  MODIFY `badge_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `campaigncategories`
--
ALTER TABLE `campaigncategories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `campaigns`
--
ALTER TABLE `campaigns`
  MODIFY `campaign_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `comment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `donations`
--
ALTER TABLE `donations`
  MODIFY `donation_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `report_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=102;

--
-- AUTO_INCREMENT for table `verifications`
--
ALTER TABLE `verifications`
  MODIFY `verification_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `address`
--
ALTER TABLE `address`
  ADD CONSTRAINT `address_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `audits`
--
ALTER TABLE `audits`
  ADD CONSTRAINT `audits_ibfk_1` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`campaign_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `campaigncategorymapping`
--
ALTER TABLE `campaigncategorymapping`
  ADD CONSTRAINT `campaigncategorymapping_ibfk_1` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`campaign_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `campaigncategorymapping_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `campaigncategories` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `campaigns`
--
ALTER TABLE `campaigns`
  ADD CONSTRAINT `campaigns_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`campaign_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `donations`
--
ALTER TABLE `donations`
  ADD CONSTRAINT `donations_ibfk_1` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`campaign_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `donations_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`donation_id`) REFERENCES `donations` (`donation_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `reports`
--
ALTER TABLE `reports`
  ADD CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`campaign_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reports_ibfk_2` FOREIGN KEY (`approved_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `userbadges`
--
ALTER TABLE `userbadges`
  ADD CONSTRAINT `userbadges_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `userbadges_ibfk_2` FOREIGN KEY (`badge_id`) REFERENCES `badges` (`badge_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `verifications`
--
ALTER TABLE `verifications`
  ADD CONSTRAINT `verifications_ibfk_1` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`campaign_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `verifications_ibfk_2` FOREIGN KEY (`verifier_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
