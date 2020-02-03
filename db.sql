SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;


CREATE TABLE IF NOT EXISTS `follows` (
  `follower` int(11) NOT NULL,
  `target` int(11) NOT NULL,
  KEY `follower` (`follower`,`target`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

TRUNCATE TABLE `follows`;
INSERT INTO `follows` (`follower`, `target`) VALUES
(1577465424, 1577465377);

CREATE TABLE IF NOT EXISTS `posts` (
  `id` int(11) NOT NULL,
  `user-id` int(11) NOT NULL,
  `post-type` enum('text','answer','photo') NOT NULL DEFAULT 'text',
  `body-text` text NOT NULL,
  `title` text NOT NULL,
  `photos` text NOT NULL,
  `question` text NOT NULL,
  `reblog-data` text NOT NULL,
  `reblog-count` int(11) NOT NULL DEFAULT '0',
  `slug` varchar(256) NOT NULL,
  `tags` text NOT NULL,
  `nsfw` tinyint(1) NOT NULL DEFAULT '0',
  `flagged` tinyint(1) NOT NULL DEFAULT '0',
  `posted-on` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=DYNAMIC;

TRUNCATE TABLE `posts`;
INSERT INTO `posts` (`id`, `user-id`, `post-type`, `body-text`, `title`, `photos`, `question`, `reblog-data`, `reblog-count`, `slug`, `tags`, `nsfw`, `flagged`, `posted-on`) VALUES
(1577465452, 1577465377, 'text', 'This is a test post.', 'Welcome to Dumblr, motherfuckers.', '', '', '', 0, 'welcome-to-dumblr-motherfuckers', '[["testing","testing"],["ichi ni san","ichi-ni-san"]]', 0, 0, 1577465452),
(1577465458, 1577465424, 'text', 'what is dthsi?', '', '', '', '', 0, 'what-isdthsi', '', 0, 0, 1577465458),
(1577465460, 1577465377, 'text', 'also I have officially no idea what I''m doing, it''s past midnight and I am the tired.', 'Welcome to Dumblr, motherfuckers.', '', '', '[{"id":1577465377,"name":"kawa-oneechan?","pic":"https://www.gravatar.com/avatar/d0bd59922f5096b2c559f2b3a5d6ded9?s=32","content":"This is a test post."}]', 1, '', '[["I am the table","i-am-the-table"]]', 0, 0, 1577465460),
(1577465480, 1577465377, 'text', '**Did you mean:** *what is this?*', '', '', '', '[{"id":1577465424,"name":"roxy-lalonde","pic":"profiles/roxy-32.png","content":"what is dthsi?"}]', 1, 'did-you-mean-what-is-this', '[["testing","testing"]]', 0, 0, 1577465480),
(1577465463, 1577465377, 'photo', '', 'tfw when you don''t get it', '[{"url":"EMMyXglWwAEffIe.jpg","caption":"sumimasen what the fuck"},{"url":"05776.gif"}]', '', '', 0, '', '', 0, 0, 1577465463),
(1577465466, 1577465377, 'photo', '', '', '[{"url":"9b9e5c15d0eb4c2a09e5018d2cd9ef65.jpg"}]', '', '', 0, '', '["shampoo","shampoo"]]', 0, 0, 1577465466),
(1577562638, 1577465424, 'text', 'Lorem ipsum dolor kiss my ass', 'Posting a new post~', '', '', '', 0, 'lorem-ipsum-dolor-kiss-my-ass', '', 0, 0, 1577562638),
(1577481040, 1577465377, 'text', 'We keep testing until productivity improves! &#x1F63D;', '&#x2699; Further testing &#x2699;', '', '', '', 0, 'we-keep-testing-until-productivity-improves-', '', 0, 0, 1577481040);

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL,
  `handle` varchar(256) NOT NULL,
  `title` varchar(512) NOT NULL,
  `password-hash` varchar(256) NOT NULL,
  `dash-color` varchar(6) NOT NULL,
  `personal-color` varchar(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

TRUNCATE TABLE `users`;
INSERT INTO `users` (`id`, `handle`, `title`, `password-hash`, `dash-color`, `personal-color`) VALUES
(1577465377, 'kawa-oneechan', '/* Logo Pending */', '2685e7f6724dad2eb0a8386e18dd3b0cb9d42b4aa92ee4e69197e543fac6e9af', '', ''),
(1577465424, 'roxy-lalonde', 'rogue of vodka', '41ed2d68ec488b14803340cf572ded1ce23dcb51ddd1d32c208fdd125f1f5559', '', '');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
