function Menu()
{
  var Menu = {};

  
  // =========================== H E A D E R =========================== //
  
  /* MEMBER FUNCTIONS */
  
  // constructor
  Menu.initMenu = initMenu;
  Menu.initDatasetList = initDatasetList;

  // setter
  Menu.setActiveColor = setActiveColor;

  /* MEMBER VARIABLES */

  // color picker
  var myActiveColor = null;

  // important elements
  var myDatasetList = $('#datasetList');
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
    myScaleD.html('discrete');
    myScaleC.html('continuous');
    myRangeA.html('absolute');
    myRangeR.html('relative');
    myMinColorSel.html('minimum color');
    myMaxColorSel.html('maximum color');

    myColorpicker.farbtastic();
  }

  function initDatasetList(inList)
  { // inList[i]
    for (var i in inList)
      myDatasetList.append($('<option></option>').val(i).html("horst"));
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
