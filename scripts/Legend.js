function Legend()
{
  var Legend = {};

  
  // =========================== H E A D E R =========================== //
  
  /* MEMBER FUNCTIONS */
  
  // constructor
  Legend.initLegend = initLegend;

  // updater
  Legend.updateYear = updateYear;
  Legend.updateDataset = updateDataset;
  Legend.updateScale = updateScale;
  
  
  /* MEMBER VARIABLES */

  // important elements
  var myDsTitle = $('#dsTitle');
  var myDsDescr = $('#dsDescr');
  var myDsNumFormat = $('#dsNumFormat');
  var myDsScale = $('.dsScale');
  var myRangeValues = $('.rangeVal');
  var myYearBox = $('#year');

  
  // =================== I M P L E M E N T A T I O N =================== //
  
  /** CONSTRUCTOR  **/
  function initLegend()
  {
    // nothing to do here ?!?
  }


  /** UPDATER **/
  function updateYear(inYear)
  {
    myYearBox.html(inYear);
  }

  function updateDataset(inDsName, inDsDescr)
  {
    // set title and description of dataset
    myDsTitle.html(inDsName);
    myDsDescr.html(inDsDescr);
  }

  function updateScale(inScale, inIntervalValues, inIntervalColors)
  {
    
    if (inScale == 'd')
    {
      // fills boxes with current bg color
      fillDiscreteScale(inIntervalColors);
    }
    
    else if (inScale == 'c')
    {
      // fill big scale box with gradient of current bg color
      fillContinuousScale(inIntervalColors);
    }
    
    // set all interval values in color scale
    // need to format them
    var min = inIntervalValues[6];
    var max = inIntervalValues[0];
    var diff = max-min;
    var decPts = 0;
    var preDecPts = 0;
    // if difference less than 1, make them "0.00"
    if (diff <= 1)
      decPts = 2;
    // if difference less than 10, make them "0.0"
    else if (diff <= 10)
      decPts = 1;
    // if difference is > 10, make integer
    else if (diff <= 1000)
      decPts = 0;
    //~ // if difference > 1000, shorten number to thousand
    else
    {
      decPts = 0;
      // get number of digits of difference between min and max value
      var len = parseInt(diff).toString().length;
      preDecPts = len-4;
    }

    // factor = 10^decPts
    var factor = Math.pow(10,decPts);

    // round values
    outIntervalValues = new Array();
    for (var i in inIntervalValues)
    {
      // predecimal rounding
      var displayValue = inIntervalValues[i]/Math.pow(10,preDecPts);
      // decimal rounding
      displayValue = (Math.round(displayValue*factor)/factor).toFixed(decPts);
      // add to final array
      outIntervalValues.push(displayValue);
    }

    // put rounded values in color scale
    myRangeValues.each(function(i)
      {
        var range = outIntervalValues[i+1] + ' - ' + (outIntervalValues[i]-1/factor).toFixed(decPts);
        $(this).html(range);
      }
    );

    // if necessary, show format of numbers
    if (preDecPts > 0)
      myDsNumFormat.html('in ' + Math.pow(10,preDecPts));
    // if not, delete it
    else
      myDsNumFormat.empty();
  }


  /** PRIVATE FUNCTIONS **/

  function fillDiscreteScale(inIntervalColors)
  {
    // remove border and background color of big scale
    myDsScale.removeClass('focus');
    myDsScale.css('background', 'none');
    myDsScale.css('filter', 'none');

    // set border and background color of small boxes
    myRangeValues.each(function(i)
      {
        $(this).addClass('focus');
        $(this).css('background',inIntervalColors[i]);
      }
    );
  }

  function fillContinuousScale(inIntervalColors)
  {
    // set border and background color of big scale
    myDsScale.addClass('focus');
    // stupid css gradient hacks...
    myDsScale.css('background', '-moz-linear-gradient(top, ' + inIntervalColors[0] + ' 0%, ' + inIntervalColors[5] + ' 100%);');
    myDsScale.css('background', '-webkit-gradient(linear, left top, left bottom, color-stop(0%,' + inIntervalColors[0] + '), color-stop(100%,' + inIntervalColors[5] + '))');
    myDsScale.css('background', '-webkit-linear-gradient(top, ' + inIntervalColors[0] + ' 0%,' + inIntervalColors[5] + ' 100%)');
    myDsScale.css('background', '-o-linear-gradient(top, ' + inIntervalColors[0] + ' 0%,' + inIntervalColors[5] + ' 100%)');
    myDsScale.css('background', '-ms-linear-gradient(top, ' + inIntervalColors[0] + ' 0%,' + inIntervalColors[5] + ' 100%)');
    myDsScale.css('background', 'linear-gradient(to bottom, ' + inIntervalColors[0] + ' 0%,' + inIntervalColors[5] + ' 100%)');
    myDsScale.css('filter', "progid:DXImageTransform.Microsoft.gradient( startColorstr='" + inIntervalColors[0] + "', endColorstr='" + inIntervalColors[5] + "',GradientType=0 )");

    // remove border and background color of small boxes
    myRangeValues.each(function(i)
      {
        $(this).removeClass('focus');
        $(this).css('background','none');
      }
    );
  }

  return Legend;
}
