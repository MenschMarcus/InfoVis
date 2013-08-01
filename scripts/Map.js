function Map()
{
  var Map = {};
  
  
  // =========================== H E A D E R =========================== //
  
  /* MEMBER FUNCTIONS */
  
  // constructor
  Map.initMap = initMap;
  
  // setter
  Map.update = update;
  
  /* MEMBER VARIABLES */
  // general world region arrays
  var myRegCodes;                   // array of codes of world regions = DOM-nodes directly in SVG (#aam, #lam, ..., #oce).size=10
  var myRegInfoBoxPos;              // array of position of info boxes of world regions
  
  // animation
  var myAni;                        // array of ten setIntervals (colour change for each region)
  
  // =================== I M P L E M E N T A T I O N =================== //  

  /** CONSTRUCTOR **/
  function initMap()
  {
    // id-codes of DOM nodes of region
    myRegCodes = new Array("AAM", "LAM", "EUR", "RUS", "ORT", "SSA", "EAS", "SAS", "SEA", "OCE");
    
    // setup info boxes on world regions
    // info box pos [px]:       aam      lam      eur      rus     ort      ssa      eas      sas      sea      oce      
    myRegInfoBoxPos = new Array(175,130, 235,280, 375,120, 560,90, 440,185, 425,250, 600,155, 545,230, 670,240, 710,330 );
    for (var i in myRegCodes)
      setupInfoBox(i);

    // make stroke around each region
    for (var i in myRegCodes)
      setStroke(i);
    
    // create array for fill colour change animation for each cc
    myAni   = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }


  /** SETTER **/
  
  /* background colour of world regions = coded variable */
  // set directly in SVG -> slower, but easier for now
  function update(inDataValues, inDataScale, inIntervalValues, inIntervalColors)
  {
    // for each world region
    for (var i in myRegCodes)
    {
      // get data value
      var dataValue = inDataValues[i];

      // calculate color from data value
      var color;
      
      // for discrete scale: order values in groups and take their color
      if (inDataScale == 'd')
      {
        // TODO: reverse order of array :/
        
        // set group initially to 0, does not need to be checked again
        var group = 0;
        // try sequentially if value fits in higher group
        while (group < 5)
        {
          // if value is not larger than lower border of interval, region is at least in next group
          if (dataValue <= inIntervalValues[group+1])
            group++;
          // if not, region is exactly in this interval and in this group
          else break;
        }
        // copy color
        color = inIntervalColors[group];
      }

      // for continuous scale: interpolate between min and max value
      else if (inDataScale == 'c')
      {
        var minVal = inIntervalValues[6];
        var maxVal = inIntervalValues[0];
        var minCol = hexToRgb(inIntervalColors[5]);
        var maxCol = hexToRgb(inIntervalColors[0]);
        // reverse linear interpolation of value
        var pos = (dataValue-minVal)/(maxVal-minVal);
        // linear interpolation of color
        var colRgb = new Object();
        colRgb.r = pos*(maxCol.r-minCol.r)+minCol.r;
        colRgb.g = pos*(maxCol.g-minCol.g)+minCol.g;
        colRgb.b = pos*(maxCol.b-minCol.b)+minCol.b;
        color = rgbToHex(colRgb);
      }

      // set color of region
      setFillCol(i, color);
    }
  }

  
  /** PRIVATE FUNCTIONS **/
  
  function setFillCol (i, newCol)
  {
    var numSteps = 10;
    var interval = 35;
  
    // get current world region node
    var ccNode = $("#mapSVG")[0].contentDocument.getElementById(myRegCodes[i]);
    
    // get old colour
    var oldCol = ccNode.getAttribute('fill');
    // if attribute not defined = very first time = assume to start with black
    if (ccNode.getAttribute('fill') == null) oldCol = '#000000';

    // get old and new color in rgb
    oldCol = hexToRgb(oldCol);
    newCol = hexToRgb(newCol);
    
    // calculte how far one animation step is in respect to colour change
    var rS = (newCol.r - oldCol.r) / (numSteps-1);
    var gS = (newCol.g - oldCol.g) / (numSteps-1);
    var bS = (newCol.b - oldCol.b) / (numSteps-1);
    
    // stop current animation (if any)
    clearInterval(myAni[i]);

    // start new animation
    var step = 1;
    myAni[i] = setInterval( function()
    {
      // make full colour from rgb string
      var currCol = rgbToHex(oldCol);
      
      // set new background colour of cc
      ccNode.setAttribute("fill", currCol);
  
      // stop animation after defined number of steps
      if (step == numSteps)
      {
        ccNode.setAttribute("fill", rgbToHex(newCol));
        window.clearInterval(myAni[i]);
      }

      // next step
      oldCol.r += rS;
      oldCol.g += gS;
      oldCol.b += bS;
      ++step;

    // animation step every x milliseconds  
    }, interval);
  }
  
  function setStroke (i)
  {
    //~ // get current world region node
    var regNode = $("#mapSVG")[0].contentDocument.getElementById(myRegCodes[i]);
    regNode.setAttribute('stroke', 'black');
    regNode.setAttribute('stroke-width', '3 px');
  }
  
  /* setup info boxes on top of world regions displaying name of region */
  function setupInfoBox(i)
  {
    // id of info box
    var id = myRegCodes[i] + 'Info' ;

    // test if info box already exists -> if so, leave function immediately
    if ($('#'+id).length > 0) return;
  
    var map = $('#map');      // parent map node

    // infobox = div box with stroke and bg-color and opactiy
    // create node element
    var infoBox = $('<div class="regInfo"></div>');
    // set (style) attributes
    $(infoBox).attr('id', id);  
    $(infoBox).css('top', myRegInfoBoxPos[i*2+1]);
    $(infoBox).css('left', myRegInfoBoxPos[i*2]);

    // add name of world region as <p> in div
    var name = $('<p class="regInfoName"></p>');
    $(name).html(loc(myRegCodes[i]));

    $(infoBox).append(name);

    // put infoBox node in DOM
    map.append(infoBox);
        
    // hide box
    $(infoBox).fadeOut(0);
    
    // slowly fade in infoBox
    $(infoBox).fadeIn(800);
  }
  
  return Map;
}
