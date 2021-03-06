<?php include 'api/session/session.php'; ?>

<!--
  mcKtt0(P9B%s7@f8 20060808002-1
--->

<!DOCTYPE html>   <!-- HTML5 -->
<!-- the "unselectable="on" is for f*** IE which does not even inherit it! -->

<html>
  <head>
    <title>SocialVis</title>
    <!-- external scripts -->
    <script src="scripts/lib/jquery.min.js"></script>
    <script src="scripts/lib/jquery.animate-colors-min.js"></script>
    <script src="scripts/lib/jquery.json.min.js"></script>
    <script src="scripts/lib/farbtastic.js"></script>
    <!-- own scripts -->
    <script src="scripts/main.js"></script>
    <script src="scripts/Model.js"></script>
    <script src="scripts/Menu.js"></script>
    <script src="scripts/Timeline.js"></script>
    <script src="scripts/Map.js"></script>
    <script src="scripts/Legend.js"></script>
    <script src="scripts/Controller.js"></script>
    <!-- stylesheets -->
    <link rel="stylesheet" type="text/css" href="style/main.css" />
    <link rel="stylesheet" type="text/css" href="style/Menu.css" />
    <link rel="stylesheet" type="text/css" href="style/Timeline.css" />
    <link rel="stylesheet" type="text/css" href="style/Map.css" />
    <link rel="stylesheet" type="text/css" href="style/Legend.css" />
  </head>
  <body>

    <div id="wrapper">
      <div id="wrapperLeft">
      
      <!-- MENU (CONTROLLER) -->
        <div id="menu" class="noTextSelect">
          <div id="menuContent">
            dataset:
            <button type="button" id="datasetPOP" class="interact testButt"></button>
            <button type="button" id="datasetLE" class="interact testButt"></button>
            <button type="button" id="datasetFR" class="interact testButt"></button>
            <br/>
            scale:
            <button type="button" id="scaleD" class="interact testButt"></button>
            <button type="button" id="scaleC" class="interact testButt"></button>
            <br/>
            range:
            <button type="button" id="rangeA" class="interact testButt"></button>
            <button type="button" id="rangeR" class="interact testButt"></button>
            <br/>
            color:
            <table id="colorSelector">
              <tr>
                <td><button type="button" id="minColorSel" class="interact testButt"></button></td>
                <td><button type="button" id="maxColorSel" class="interact testButt"></button></td>
              </tr>
              <tr>
<!--
                <td><input type="text" id="minColor" name="maxColor" value="#123456" /></td>
                <td><input type="text" id="maxColor" name="maxColor" value="#123456" /></td>
-->
              </tr>
            </table>
            <div id="colorpicker"></div>
          </div>
        </div>
      </div>

      <div id="wrapperRight">
      
        <div id="map" class="noTextSelect">
          <!-- MAP -->
          <object id="mapSVG" data="graphics/map.svg" type="image/svg+xml" width="851" height="431">
            Your browser does not support SVG. Please get a new one.
          </object>

          <!-- LEGEND -->
          <div id="legend">
            <div id="dsTitle"></div>
            <div id="dsDescr"></div>
            <div id="dsNumFormat"></div>
            <div id="dsScaleWrapper">
              <div class="dsScale">
                <div id="rangeVal1" class="rangeVal"></div>
                <div id="rangeVal2" class="rangeVal"></div>
                <div id="rangeVal3" class="rangeVal"></div>
                <div id="rangeVal4" class="rangeVal"></div>
                <div id="rangeVal5" class="rangeVal"></div>
                <div id="rangeVal6" class="rangeVal"></div>
              </div>
            </div>
          </div>
          <div id="year"></div>
        </div>
        
        <!-- TIMELINE -->
        <div id="timeline" class="noTextSelect">
          <div id="aniControl">
            <div id="aniDirection">
              <button type="button" id="directionBack" class="interact"></button>
              <div id="directionValWrapper">
                <span id="directionVal"></span>
              </div>
              <button type="button" id="directionForw" class="interact"></button>
            </div>          
            <button type="button" id="playButt" class="interact"></button>
            <div id="aniSpeed">
              <button type="button" id="speedDecr" class="interact"></button>
              <div id="speedValWrapper">
                <span id="speedVal"></span>
              </div>
              <button type="button" id="speedIncr" class="interact"></button>
            </div>
          </div>
          <div id="tlMain"></div>
        </div>
      </div>
    </div>
    <div id="imprint"></div>
  

  </body>
</html>

