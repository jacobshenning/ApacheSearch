<?php

if (!is_dir('ApacheSearch')) {
  ini_set('display_errors', 1);
  ini_set('display_startup_errors', 1);
  error_reporting(E_ALL);
}

require 'controllers/app_controller.php';

require 'views/header.php';

require 'views/body.php';

require 'views/footer.php';
