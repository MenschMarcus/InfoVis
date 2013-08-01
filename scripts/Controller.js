function Controller()
{
  var Controller = {};
  
  
  // =========================== H E A D E R =========================== //
  
  /* MEMBER FUNCTIONS */
  
  // constructor
  Controller.initController = initController;

  // setter
  Controller.setNowYear = setNowYear;
  Controller.setDataset = setDataset;
  Controller.setDataScale = setDataScale;
  Controller.setDataRange = setDataRange;
  Controller.setColorScheme = setColorScheme;

  /* MEMBER VARIABLES */

  var myNowYear = 1989;               // current year of visualisation [!!!]

  // dataset
  var myDataset = 0;                  // currently selected dataset (index in array myDatasets)
  var myDataValues = new Array();     // array storing ten current data values for world regions [0]='AAM', [1]='LAM', ...

  // legend
  var myDataScale = "d";              // d = discrete (six steps), c = continuous (more than six steps)
  var myDataRange = "a";              // a = absolute (static min/max), r = relative (current min/max)
  var myMinCol = '#CCECE6';           // minimum color for color scheme    
  var myMaxCol = '#005824';           // maximum color for color scheme
  var myIntervalColors = new Array(); // array storing all six interval colors
  var myIntervalValues = new Array(); // array storing seven values for interval

  // mouse interaction
  var myLastPos = 0;                // last position of click in the UI
  var myIsOnTimeline = false;       // mouse clicked on timeline? 
  var myIsOnNowMarker = false;      // mouse clicked on now marker?

  /* important elements */

  // timeline
  var myTimeline = $('#tlMain');
  var myNowMarker = $('#nowMarker');

  // animation control
  var myPlayButt = $('#playButt');
  var myDirectVal = $('#directionVal');
  var myDirectForw = $('#directionForw');
  var myDirectBack = $('#directionBack');
  var mySpeedVal = $('#speedVal');
  var mySpeedIncr = $('#speedIncr');
  var mySpeedDecr = $('#speedIDecr');

  // menu
  var myDatasetLE = $('#datasetLE');
  var myDatasetFR = $('#datasetFR');
  var myDatasetPOP = $('#datasetPOP');
  var myScaleD = $('#scaleD');
  var myScaleC = $('#scaleC');
  var myRangeA = $('#rangeA');
  var myRangeR = $('#rangeR');
  var myColorpicker = $('#colorpicker');
  var myMinColorSel = $('#minColorSel');
  var myMaxColorSel = $('#maxColorSel');
  

  // =================== I M P L E M E N T A T I O N =================== //  

  /** CONSTRUCTOR **/
  
  function initController()
  {
    console.log('MUH!');
    
    // init members
    getDataValues();
    getIntervalValues();
    getIntervalColors();

    // initially set timeline range and now marker
    Timeline.initRange(Model.getYearRange()[0], Model.getYearRange()[1]);
    Timeline.initNowMarker(myNowYear);

    // initially fill year box
    Legend.updateYear(myNowYear);

    // initially fill legend
    Legend.updateDataset(loc(myDataset+'title'), loc(myDataset+'descr'));
    Legend.updateScale(myDataScale, myIntervalValues, myIntervalColors);

    // initially update map
    Map.update(myDataValues, myDataScale, myIntervalValues, myIntervalColors);

    // initially setup color picker
    Menu.setActiveColor('min', myMinCol);
  }

  /** SETTER **/
  
  function setNowYear(inYear)
  {
    // if nowYear has actually changed
    if (inYear != myNowYear)
    {
      myNowYear = inYear;
      getDataValues();
      if (myDataRange == 'r')
        getIntervalValues();

      /* UPDATE VIEW */
      Legend.updateYear(myNowYear);
      if (myDataRange == 'r')
        Legend.updateScale(myDataScale, myIntervalValues, myIntervalColors);

      Map.update(myDataValues, myDataScale, myIntervalValues, myIntervalColors);
    }
  }

  function setDataset(inDsName)
  {
    var newDataset = Model.getDatasetInfo(inDsName);
    
    // if changed -> reset currently visualised dataset
    if (newDataset != myDataset)
    {
      myDataset = newDataset;
      getDataValues();
      getIntervalValues();

      /* UPDATE VIEW */
      Legend.updateDataset(myDataset[1], myDataset[2]);
      Legend.updateScale(myDataScale, myIntervalValues, myIntervalColors);
      Map.update(myDataValues, myDataScale, myIntervalValues, myIntervalColors);
    }
  }

  function setDataScale(inScale)
  {
    // error handling
    if (inScale != 'd' && inScale != 'c')
    {
      console.log("This data scale does not exist! Set discrete as default scale.");
      inScale = 'd';
    }
    
    // if scale changed -> update it
    if (inScale != myDataScale)
    {
      myDataScale = inScale;
      
      /* UPDATE VIEW */
      Legend.updateScale(myDataScale, myIntervalValues, myIntervalColors);
      Map.update(myDataValues, myDataScale, myIntervalValues, myIntervalColors);
    }
  }
  
  function setDataRange(inRange)
  {
    // error handling
    if (inRange != 'a' && inRange != 'r')
    {
      console.log("This data range does not exist! Set absolute as default range.");
      inRange = 'a';
    }
    
    // if range changed -> update
    if (inRange != myDataRange)
    {
      myDataRange = inRange;
      getIntervalValues();
      
      /* UPDATE VIEW */
      Legend.updateScale(myDataScale, myIntervalValues, myIntervalColors);
      Map.update(myDataValues, myDataScale, myIntervalValues, myIntervalColors);
    } 
  }
  
  function setColorScheme (inColorName, inColorValue)
  {
    if (inColorName == 'min')
      myMinCol = inColorValue;
    else if (inColorName == 'max')
      myMaxCol = inColorValue;
    getIntervalColors();

    /* UPDATE VIEW */
    Legend.updateScale(myDataScale, myIntervalValues, myIntervalColors);
    Map.update(myDataValues, myDataScale, myIntervalValues, myIntervalColors);
  }


  /** MOUSE INTERACTION **/

  /* for both timeline now marker:
    click -> change marker position once
    drag marker -> change marker position continuously */
  /* catch every mouse event happened in the whole window / document
   -> then forward to specific element */

  function eventUITarget(evt, node)
  {
    /* check if clicked on certain elements or
      if desired element is one of their parents
      syntax: "closest(desEl)" is an object containing all elements
      in the DOM tree of the node clicked on that match with desEl
      => if there is one element in this object, then it is
      the one we are looking for, so the length of the object is 1 
      (otherwise it is 0)
    */
    return $(evt.target).closest(node).length==1;
  }
   
  $(document).mousedown(function(evt)
    {
      // prevent mouse cursor to become pointer in Chrome
      evt.preventDefault();
    
      // only react on left mouse button
      if (evt.which != 1) return;

      // set last position user clicked on
      myLastPos = evt.pageX;

      // check in which part of the UI mouse interaction happened
      // -> redirect event there
        
      // clicked on timeline?
      if (eventUITarget(evt, myTimeline))
        myIsOnTimeline = true;
      // clicked on nowMarker?
      if (eventUITarget(evt, myNowMarker))
        myIsOnNowMarker = true;
    }
  );

  $(document).mousemove(function(evt)
    {
      // click position
      var xPos = evt.pageX;

      // check in which part of the UI mouse interaction happened
      // -> redirect event there
      if (eventUITarget(evt, myTimeline))
      {
        // distance moved since last event
        var xDist = evt.pageX-myLastPos;
        // clicked the nowMarker on the timeline? => drag it continuously!
        if (myIsOnNowMarker)
          Timeline.setNowMarker(toTlPos(xPos));
      }
    }
  );

  $(document).mouseup(function (evt)
    {
      // only react on left mouse button
      if (evt.which != 1) return

      // get click position
      var xPos = evt.pageX;

      // check in which part of the UI mouse interaction happened
      // -> redirect event there
      if (eventUITarget(evt, myTimeline))
      {
        // clicked on timeline? => animate now marker there
        if (myIsOnTimeline && !myIsOnNowMarker)
          Timeline.clickAni(toTlPos(xPos));

        // always stop animation after dragging
        if (myIsOnNowMarker)
          Timeline.pauseAni();
      }

      // mouse is not down on any element anymore
      myIsOnTimeline = false;
      myIsOnNowMarker = false;
    }
  );

  $(document).click(function(evt)
    {
      // only react on left mouse button
      if (evt.which != 1) return
      // check in which part of the UI mouse interaction happened
      // -> redirect event there

      /* TIMELINE ANIMATION CONTROL */
      // click the play button in the animation control => play/pause animation
      if (eventUITarget(evt, myPlayButt))
        Timeline.toggleAni();
      // click the speed decrease/increase buttons
      else if (eventUITarget(evt, mySpeedDecr))
        Timeline.changeSpeed(-1);
      else if (eventUITarget(evt, mySpeedIncr))
        Timeline.changeSpeed(1);
      // click the direction forward/backward buttons  
      else if (eventUITarget(evt, myDirectBack))
        Timeline.changeDirection(-1);
      else if (eventUITarget(evt, myDirectForw))
        Timeline.changeDirection(1);

      /* MENU */
      else if (eventUITarget(evt, myDatasetLE))
        setDataset('LE');
      else if (eventUITarget(evt, myDatasetFR))
        setDataset('FR');
      else if (eventUITarget(evt, myDatasetPOP))
        setDataset('POP');
      else if (eventUITarget(evt, myScaleC))
        setDataScale('c');
      else if (eventUITarget(evt, myScaleD))
        setDataScale('d');
      else if (eventUITarget(evt, myRangeA))
        setDataRange('a');
      else if (eventUITarget(evt, myRangeR))
        setDataRange('r');
      else if (eventUITarget(evt, myMinColorSel))
        Menu.setActiveColor('min', myMinCol);
      else if (eventUITarget(evt, myMaxColorSel))
        Menu.setActiveColor('max', myMaxCol);
    }
  );

  /** KEYBOARD INTERACTION **/

  /* use the keyboard to control animation */
  $(document).keydown(function(evt)
    {
      // get key code
      var key = (evt.keyCode ? evt.keyCode : evt.which);
      
      // Space = toggle animation
      if (key == 32)
        Timeline.toggleAni();
          
      // + = faster
      else if ((key == 107) || (key == 43) || (key == 187) )
      {
        evt.preventDefault();   // for Opera to not zoom into site
        Timeline.changeSpeed(+1);
      }
      // - = slower
      else if ((key == 109) || (key == 45) || (key == 189) )
      {
        evt.preventDefault();   // for Opera to not zoom out of site
        Timeline.changeSpeed(-1);
      }
      
      // arrow left / right = change direction
      else if (key == 37 || key == 52)
        Timeline.changeDirection(-1);
      else if (key == 39 || key == 54)
        Timeline.changeDirection(1);
    }
  );

  /** PRIVATE FUNCTIONS **/

  function getDataValues()
  {
    var outDataValues = new Array()
    for (var i=0; i<10; i++)
      outDataValues.push(Model.getValueForRegion(myDataset, myNowYear, i));
    myDataValues = outDataValues;
  }

  function getIntervalValues()
  {
    // get min / max values from dataset, either absolute (1960-2010) or relative (to nowYear)
    var valueRange;
    if (myDataRange == 'a')
      valueRange = Model.getValueRange(myDataset);
    else if (myDataRange == 'r')
      valueRange = Model.getValueRange(myDataset, myNowYear);

    // set member
    var minVal = valueRange[0];
    var maxVal = valueRange[1];
    
    // set loop variables
    var val = maxVal;
    var step = (maxVal-minVal)/6;
    
    // fill interval values
    var outIntervalValues = new Array();
    for (var i=0; i<=6; i++)
    {
      outIntervalValues.push(val)
      val -= step;
    }

    // return the array
    myIntervalValues = outIntervalValues;
  }

  function getIntervalColors()
  {
    // set start color
    var col = new Object();
    col.r = hexToRgb(myMaxCol).r;
    col.g = hexToRgb(myMaxCol).g;
    col.b = hexToRgb(myMaxCol).b;

    // set how far rgb values increase per step
    var stepR = (hexToRgb(myMaxCol).r-hexToRgb(myMinCol).r)/5;
    var stepG = (hexToRgb(myMaxCol).g-hexToRgb(myMinCol).g)/5;
    var stepB = (hexToRgb(myMaxCol).b-hexToRgb(myMinCol).b)/5;

    // fill color array
    var outIntervalCols = new Array();
    for (var i=0; i<6; i++)
    {
      outIntervalCols.push(rgbToHex(col));
      col.r -= stepR;
      col.g -= stepG;
      col.b -= stepB;
    }

    // set member
    myIntervalColors = outIntervalCols;
  }
  
  /** AUXILIARY FUNCTIONS **/
  
  function toTlPos(inPos)
  {
    // clicked pos = x value of click in document - x position of div
    return outPos = Math.round(inPos - myTimeline.offset().left);
  }

  return Controller;
}
