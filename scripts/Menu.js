function Menu()
{
  var Menu = {};

  
  // =========================== H E A D E R =========================== //
  
  /* MEMBER FUNCTIONS */
  
  // constructor
  Menu.initMenu = initMenu;

  // setter
  Menu.setActiveColor = setActiveColor;

  /* MEMBER VARIABLES */

  // color picker
  var myActiveColor = null;

  // important elements
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
  
  /** CONSTRUCTOR  **/
  
  function initMenu()
  {
    // fill buttons with names
    myDatasetLE.html(loc('LEtitle'));
    myDatasetFR.html(loc('FRtitle'));
    myDatasetPOP.html(loc('POPtitle'));
    myScaleD.html('discrete');
    myScaleC.html('continuous');
    myRangeA.html('absolute');
    myRangeR.html('relative');
    myMinColorSel.html('minimum color');
    myMaxColorSel.html('maximum color');

    myColorpicker.farbtastic();
  }


  /** SETTER **/

  function setActiveColor(inName, inColor)
  {
    // error handling
    if (inName != 'min' && inName != 'max')
    {
      console.log('Error! Given color name does not exist. Set minimum color als default.');
      inName = 'min';
    }

    // set member
    myActiveColor = inName;

    // set color in colorpicker
    $.farbtastic(myColorpicker).setColor(inColor);
  }


  /** PRIVATE FUNCTIONS **/

  // continuously update color
  myColorpicker.farbtastic(function(color)
    {
      Controller.setColorScheme(myActiveColor, color);
    }
  );


  return Menu;
}
