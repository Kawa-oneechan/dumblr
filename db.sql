SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;


DROP TABLE IF EXISTS `follows`;
CREATE TABLE IF NOT EXISTS `follows` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `follower` varchar(40) NOT NULL,
  `target` varchar(40) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `follower` (`follower`,`target`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

INSERT INTO `follows` (`id`, `follower`, `target`) VALUES
(1, '1577465424', 'c2f24062-5195-4ac9-b65c-e4b8ffd88755'),
(2, '1577465424', '1580755445');


DROP TABLE IF EXISTS `posts`;
CREATE TABLE IF NOT EXISTS `posts` (
  `id` varchar(40) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `user-id` varchar(40) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `post-type` enum('text','photo','photoset') NOT NULL DEFAULT 'text',
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
  UNIQUE KEY `id` (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=DYNAMIC;

INSERT INTO `posts` (`id`, `user-id`, `post-type`, `body-text`, `title`, `photos`, `question`, `reblog-data`, `reblog-count`, `slug`, `tags`, `nsfw`, `flagged`, `posted-on`) VALUES
('1577465452', 'c2f24062-5195-4ac9-b65c-e4b8ffd88755', 'text', 'This is a test post.', 'Welcome to Dumblr, motherfuckers.', '', '', '', 0, 'welcome-to-dumblr-motherfuckers', '[["testing","testing"],["ichi ni san","ichi-ni-san"]]', 0, 0, 1577465452),
('1577465458', '1577465424', 'text', 'what is dthsi?', '', '', '', '', 0, 'what-isdthsi', '', 0, 0, 1577465458),
('1577465460', 'c2f24062-5195-4ac9-b65c-e4b8ffd88755', 'text', 'also I have officially no idea what I''m doing, it''s past midnight and I am the tired.', 'Welcome to Dumblr, motherfuckers.', '', '', '[{"id":"c2f24062-5195-4ac9-b65c-e4b8ffd88755","name":"kawa-oneechan?","pic":"https://www.gravatar.com/avatar/d0bd59922f5096b2c559f2b3a5d6ded9?s=32","content":"This is a test post."}]', 1, '', '[["I am the table","i-am-the-table"]]', 0, 0, 1577465460),
('1577465480', 'c2f24062-5195-4ac9-b65c-e4b8ffd88755', 'text', '**Did you mean:** *what is this?*', '', '', '', '[{"id":"1577465424","name":"roxy-lalonde","pic":"profiles/1577465424-32.png","content":"what is dthsi?"}]', 1, 'did-you-mean-what-is-this', '[["testing","testing"]]', 0, 0, 1577465480),
('1577465463', 'c2f24062-5195-4ac9-b65c-e4b8ffd88755', 'photoset', '', 'tfw when you don''t get it', '{"count":2,"layout":"2","photos":[{"url":"/uploads/EMMyXglWwAEffIe.jpg","caption":"sumimasen what the fuck"},{"url":"/uploads/05776.gif"}]}', '', '', 0, '', '', 0, 0, 1577465463),
('1577465466', '1580755445', 'photo', '', '', '{"count":1,"photos":[{"url":"/uploads/9b9e5c15d0eb4c2a09e5018d2cd9ef65.jpg"}]}', '', '', 0, '', '[["shampoo","shampoo"]]', 0, 0, 1577465466),
('1577562638', '1577465424', 'text', 'Lorem ipsum dolor kiss my ass', 'Posting a new post~', '', '', '', 0, 'lorem-ipsum-dolor-kiss-my-ass', '', 0, 0, 1577562638),
('1577481040', 'c2f24062-5195-4ac9-b65c-e4b8ffd88755', 'text', 'We keep testing until productivity improves! &#x1F63D;', '&#x2699; Further testing &#x2699;', '', '', '', 0, 'we-keep-testing-until-productivity-improves-', '', 0, 0, 1577481040),
('1580651866', '1577465424', 'text', 'test', 'test', '', '', '', 0, 'test', '[["I am the table!","i-am-the-table"],["And so the King is once again my guest","and-so-the-king-is-once-again-my-guest"]]', 0, 0, 1580651866);


DROP TABLE IF EXISTS `themes`;
CREATE TABLE IF NOT EXISTS `themes` (
  `id` varchar(40) NOT NULL,
  `main-template` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

INSERT INTO `themes` (`id`, `main-template`) VALUES
('1580755445', '<html>\r\n<head>\r\n<title>{BlogTitle}</title>\r\n</head>\r\n<body>\r\n{block:Posts}\r\n{block:Text}\r\n{block:Title}<h1>{Title}</h1>{/block:Title}\r\n{Body}\r\n{/block:Text}\r\n{block:Photo}\r\n<img src="{PhotoURL}">\r\n{/block:Photo}\r\n{block:Photoset}\r\n{block:Photos}\r\n<img src="{PhotoURL}">\r\n{/block:Photos}\r\n{/block:Photoset}\r\n{/block:Posts}\r\n</body>\r\n</html>');


DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` varchar(40) NOT NULL,
  `parent-id` varchar(40) NOT NULL,
  `handle` varchar(256) NOT NULL,
  `title` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `password-hash` varchar(256) NOT NULL,
  `dash-color` varchar(6) NOT NULL,
  `personal-color` varchar(6) NOT NULL,
  `all-nsfw` tinyint(1) NOT NULL DEFAULT '0',
  `show-nsfw` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `handle` (`handle`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

INSERT INTO `users` (`id`, `parent-id`, `handle`, `title`, `password-hash`, `dash-color`, `personal-color`, `all-nsfw`, `show-nsfw`) VALUES
('c2f24062-5195-4ac9-b65c-e4b8ffd88755', '0', 'kawa-oneechan', '/* Logo Pending */', '2685e7f6724dad2eb0a8386e18dd3b0cb9d42b4aa92ee4e69197e543fac6e9af', '', '', 0, 0),
('1577465424', '0', 'roxy-lalonde', 'rogue of vodka', '41ed2d68ec488b14803340cf572ded1ce23dcb51ddd1d32c208fdd125f1f5559', '', '', 0, 0),
('1580755445', '1577465424', 'maonichuan', 'Maōnichuan', '*', '', '', 0, 0);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
