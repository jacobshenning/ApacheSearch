<?php

function is_app($file)
{
  if (!is_dir($file))
    return false;

  if (file_exists("$file/index.php") || file_exists("$file/public/index.php"))
    return true;

  return false;
}

function find_apps($path)
{
  $pre = '../Apache';
  if (!is_dir('ApacheSearch')) {
    $pre = '../';
  }

  $apps = array();

  $files = scandir($pre . $path);

  foreach ($files as $file) {
    if ($file === '.' || $file === '..' || !is_dir($pre . "$path/$file")) {
      //  Do nothing
    } else if (is_app($pre . "$path/$file")) {
      array_push($apps, substr("$path/$file", 1));
    } else {
      $apps = array_merge($apps, find_apps("$path/$file"));
    }
  }

  return $apps;
}

function get_apps()
{
  return find_apps('');
}

function get_cookie($name) {
  $name = str_replace(' ', '_', $name);
  if (isset($_COOKIE[$name])) {
    return $_COOKIE[$name];
  }
  return "";
}
