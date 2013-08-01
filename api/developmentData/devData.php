<?php
  // include db.php file which contains DataBase class
  require_once('devDB.php');
    
  // use the development database
  $db = new DataBase();
  
  // create arrays that will later contain data
  // ["cc"] = cc code from AAM to OCE, ["fr"] = fr from AAM to OCE, ["le"] = le from AAM to OCE
  $leData = array();
  $frData = array();
  $popData = array();
  
  /* create final arrays like this: [year][cc] */
  // outer array: year
  // -> 51 entries: 1960, 1961, ... , 2010
  for ($year=1960; $year<=2010; $year++)
  {
    // inner array: cc => make (2010-1960) arrays inside array
    // -> 10 entries: AAM, LAM, ... , OCE
    $leData[$year] = array();
    $frData[$year] = array();
    $popData[$year] = array();
  }  
  
  // get fertility rate and life expectancy for all culture continents for all years
  /* order: (id, code, id in db)
    0 aam 1, 1 lam 4, 2 eur 3, 3 rus 7, 4 ort 6,
    5 ssa 10, 6 eas 2, 7 sas 8, 8 sea 9, 9 oce 5
  */
  $dbOrder = array(1, 4, 3, 7, 6, 10, 2, 8, 9, 5);
  $regNames = array('AAM', 'LAM', 'EUR', 'RUS', 'ORT', 'SSA', 'EAS', 'SAS', 'SEA', 'OCE');
  
  // 1. loop: year
  for ($year=1960; $year<=2010; $year++)
  {
    // 2. loop cc's
    for ($i=0; $i<=9; $i++)
    {
      // get data from DB
      $data = $db->getDevData($year, $dbOrder[$i]);
      $leData[$year][$regNames[$i]]  = $data["LE"];
      $frData[$year][$regNames[$i]]  = $data["FR"];
      $popData[$year][$regNames[$i]] = $data["POP"];
    }
  }
  
  $return = array("LE"=>$leData, "FR"=>$frData, "POP"=>$popData);
  
  // return result array
  print_r(json_encode($return));
  
  // print result
#  echo "data for year " . $year . "<br />";
#  for ($i = 0; $i < 10; $i++)
#  {
#    echo
#      "<br /> cultCont: " . $ccData[$i] .
#      "<br /> lifeExp: " .  $leData[$i] .
#      "<br /> fertRate: " . $frData[$i] ;
#  }
?>  
