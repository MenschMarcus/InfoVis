<?php
  // use php console for debugging    
  // require_once('../PhpConsole.php');
  // PhpConsole::start();

  // session starts at this point
  session_start();
  
  // save session id
  $_SESSION['id'] = session_id();
  
  // DEBUG: default vis type, erase when done
  $_SESSION['group'] = 'S';

  /* internationalisation in EN or DE */
  // set DE as default first, so that lang is definitely defined
  if (!isset($_SESSION['lang']))
    $_SESSION['lang'] = 'en';     // default value

  //~ $allowedLangs = array('en', 'de');
  //~ 
  //~ // check if another language is given in URL as parameter 'lang'
  //~ if (isset($_POST['lang']) && in_array($_POST['lang'], $allowedLangs))
    //~ $_SESSION['lang'] = $_POST['lang'];

?>
