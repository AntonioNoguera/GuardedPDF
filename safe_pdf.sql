-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 15-10-2024 a las 02:34:23
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `safe_pdf`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `file_table`
--

CREATE TABLE `file_table` (
  `file_id` int(11) NOT NULL,
  `file_title` varchar(80) NOT NULL,
  `file_description` varchar(100) NOT NULL,
  `file_created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `file_created_by` int(11) NOT NULL,
  `file_visible_for_all` tinyint(1) DEFAULT 0,
  `file_is_merge` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `merge_member_table`
--

CREATE TABLE `merge_member_table` (
  `merge_member_id` int(11) NOT NULL,
  `file_id` int(11) NOT NULL,
  `merge_result_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `role_table`
--

CREATE TABLE `role_table` (
  `role_id` int(11) NOT NULL,
  `role_name` varchar(60) NOT NULL,
  `role_description` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_table`
--

CREATE TABLE `user_table` (
  `user_id` int(11) NOT NULL,
  `user_name` varchar(50) NOT NULL,
  `user_fullname` varchar(100) NOT NULL,
  `user_password` varchar(255) NOT NULL,
  `user_password_salt` varchar(255) NOT NULL,
  `user_role_id` int(11) NOT NULL,
  `user_created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `user_authorized` tinyint(1) NOT NULL DEFAULT 0,
  `user_last_login` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `file_table`
--
ALTER TABLE `file_table`
  ADD PRIMARY KEY (`file_id`),
  ADD KEY `file_created_by` (`file_created_by`);

--
-- Indices de la tabla `merge_member_table`
--
ALTER TABLE `merge_member_table`
  ADD PRIMARY KEY (`merge_member_id`),
  ADD KEY `file_id` (`file_id`),
  ADD KEY `merge_result_id` (`merge_result_id`);

--
-- Indices de la tabla `role_table`
--
ALTER TABLE `role_table`
  ADD PRIMARY KEY (`role_id`),
  ADD UNIQUE KEY `role_name` (`role_name`);

--
-- Indices de la tabla `user_table`
--
ALTER TABLE `user_table`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `user_fullname` (`user_fullname`),
  ADD KEY `user_role_id` (`user_role_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `file_table`
--
ALTER TABLE `file_table`
  MODIFY `file_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `merge_member_table`
--
ALTER TABLE `merge_member_table`
  MODIFY `merge_member_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `role_table`
--
ALTER TABLE `role_table`
  MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `user_table`
--
ALTER TABLE `user_table`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `file_table`
--
ALTER TABLE `file_table`
  ADD CONSTRAINT `file_table_ibfk_1` FOREIGN KEY (`file_created_by`) REFERENCES `user_table` (`user_id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `merge_member_table`
--
ALTER TABLE `merge_member_table`
  ADD CONSTRAINT `merge_member_table_ibfk_1` FOREIGN KEY (`file_id`) REFERENCES `file_table` (`file_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `merge_member_table_ibfk_2` FOREIGN KEY (`merge_result_id`) REFERENCES `file_table` (`file_id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `user_table`
--
ALTER TABLE `user_table`
  ADD CONSTRAINT `user_table_ibfk_1` FOREIGN KEY (`user_role_id`) REFERENCES `role_table` (`role_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;