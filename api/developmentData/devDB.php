<?php
  class DataBase
  {
    private $dbConnection;

    function __construct()
    {
	    try
	    {
		    // connect to the database
		    $this->dbConnection = mysqli_connect("mysql.knallhart.de","20060808002-1","mcKtt0(P9B%s7@f8","20060808002-1");
		    //$this->dbConnection = mysqli_connect("localhost","root",null,"development");
	    }
	    // If a problem occurs
	    catch (Exception $e)
	    {
		    // avoid printing error output if on non-development site,
		    // output may include connection information!
		    echo "Failed to connect to MySQL: " . mysqli_connect_error();
		    echo $e->getMessage();
		    die("died while connecting DB");
	    }
    }
    
    function close()
    {
      mysqli_close($this->dbConnection);
    }
    
    // query data for one culture continent at one certain year
    function getDevData($year, $regId)
    {
      // get code of queried culture continent (not needed anymore)
      
      // get life expectancy and fertility rate of queried culture continent
      $devData = $this->queryRegData($year, $regId);
      $leData = $devData[0];
      $frData = $devData[1];
      $popData = $devData[2];
      
      // return array for one culture continent: LE, FR
      return array("LE"=>$leData, "FR"=>$frData, "POP"=>$popData);
    }
    
    // returns code of queried culture continent (e.g. "aam" or "eur")
    function queryRegCode($regId)
    {
      // query itself (parameter variable placeholder: "?")
      $query = "
        SELECT ccCode
        FROM aad_worldRegion
        WHERE ccId = ?
      ";
      
      // use query in a statement, so it can take parameters and can be executed (?)
      $statement = $this->dbConnection->prepare($query);
      
      // put value of variables into "?" placeholder
      // "i" for int, "d" for double, "s" for string
      $statement->bind_param("i", $regId);
      
      // query the database
      $statement->execute();
      
      // get the results of the query
      $statement->bind_result($code);
      while($statement->fetch())
      {
        $regCode = $code;
      }
      
      // cleanup
      $statement->close();
      
      return $regCode;
    }
    
    // returns array of lifeExp and fertRate of queried culture continent
    function queryRegData($year, $regId)
    {
      // make column identifiers in this syntax: "leYYYY", "frYYYY" and "popYYYY"
      $le = 'le' . $year;
      $fr = 'fr' . $year;
      $pop = 'pop' . $year;
      
      // query itself (parameter variable placeholder: "?")
      $query = "
        SELECT cID, cNameEN, " . $le . ", " . $fr . ", " . $pop . "
        FROM aad_country, aad_lifeExp, aad_fertRate, aad_population
        WHERE leID=cID AND frID=cID AND popID=cID AND c2cc= ?
        ORDER BY cNameEN
      ";
      
      // use query in a statement, so it can take parameters and can be executed (?)
      $statement = $this->dbConnection->prepare($query);
      
      // put value of variables into "?" placeholder
      // "i" for int, "d" for double, "s" for string
      $statement->bind_param("i", $regId);
      
      // query the database
      $statement->execute();
      
      // get the results of the query (every SELECT must be a single return variable!)
      $statement->bind_result($resC, $resName, $resLE, $resFR, $resPOP);
      
      // calculate mean values for life expectancy and fertility rate

      // accumulated lifeExp / fertRate / population value
      // = lifeExp / fertRate of that country * population of that country
      $accLE = 0;
      $accFR = 0;
      $accPOP = 0;
      // population of all countries where data for lifeExp / fertRate / pop is given
      // -> so that it can be used to calculate mean lifeExp / fertRate / pop
      $relevPopLE = 0;
      $relevPopFR = 0;
      
      while($statement->fetch())
      {
        // accumulate relevant population for LE and FR = 
        // countries for which data about LE / FR is given at the requested date
        if ($resLE > 0)  $relevPopLE += $resPOP;  
        if ($resFR > 0)  $relevPopFR += $resPOP;
        
        // accumulate lifeExp / fertRate value (LE/FR * population)
        if ($resLE > 0)  $accLE += $resPOP * $resLE;  
        if ($resFR > 0)  $accFR += $resPOP * $resFR;

        // accumulate population
        $accPOP += $resPOP;
      }
      
      // calculate weighted lifeExp / fertRate
      $finalLE = $accLE / $relevPopLE;
      $finalFR = $accFR / $relevPopFR;
      
      // cleanup
      $statement->close();

      // return both in an array
      return array($finalLE, $finalFR, $accPOP);
    }
  }
?>
