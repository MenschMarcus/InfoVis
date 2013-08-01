<?php
  session_start();
      
  // use the necessary language file
  //$root = realpath($_SERVER["DOCUMENT_ROOT"]) . '/socialvis';
  $root = realpath($_SERVER["DOCUMENT_ROOT"]) . '/infovis';
  //$root = realpath($_SERVER["DOCUMENT_ROOT"]) . '/BAprototype';
  //~ include($root . '/locale/' . $_SESSION['lang'] . '.php');
  include($root . '/locale/en.php');

  // get phrase from URL
  if (isset($_GET["phrase"]))
  {
    $phrase = $_GET["phrase"];
    // get translation out of lang.php file      
    if (array_key_exists($phrase, $translation))
      echo $translation[$phrase];
    // if translation not found, the name of the phrase itself is used as the translation
    else
      echo $phrase;
  }  

?>
