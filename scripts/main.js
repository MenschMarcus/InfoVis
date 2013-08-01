/** INITIALISATION OF EVERYTHING **/

$(document).ready(function()
  {
    setTimeout(function()
      {
        // first check if user has not used Internet Explorer
        if (BrowserDetect.browser == "Explorer")
        {
          takeOtherBrowser();
          return;
        }
        // (if browser is not IE)

        /* INITIALISATION */

        // initialise model
        Model = Model();
        Model.initModel();

        // initialise view
        Menu = Menu();
        Menu.initMenu();
        Legend = Legend();
        Legend.initLegend();
        Map = Map();
        Map.initMap();
        Timeline = Timeline();
        Timeline.initTimeline();

        // initialise controller
        Controller = Controller();
        Controller.initController(); // --> will be done by Model because it needs so long to load

        // make imprint
        $('#imprint').html(loc('imprint'));
        
        // disable text selection for all major elements
        disableTextSelectFor('map');
        disableTextSelectFor('timeline');
      }
    ,500);
  
  }
);

function takeOtherBrowser()
{
  alert(loc('otherBrowserTitle'));
/*
  $('#wrapperLeft').css('left','50%');
  $('#wrapperLeft').css('margin-left','-200px');
  $('#wrapperLeft').css('width','400px');
  $('#navigation').css('width','400px');
  $('#wrapperRight').css('display','none');
  $('#stepTitle').html(loc('otherBrowserTitle'));
  $('#stepText').html(loc('otherBrowserText'));
*/
}


/** AUXILIARY FUNCTIONS **/

function loc(phrase)
{
  var locString = phrase;

  //~ $.ajax({
    //~ // force synchronous ajax call, to return with locale string
    //~ async: false,
    //~ // url with to be translated id
    //~ url: "api/session/translation.php?phrase=" + phrase,
    //~ // "get" for small data (otherwise "post")
    //~ method: "get",
    //~ // callback function after server has reveiced information
    //~ success: function (data)
      //~ {
        //~ locString = data;
      //~ }
  //~ });
    
  return locString;
}

function disableTextSelectFor(id)
{
  var allNodes = $('#'+id).find('*');
  for (var i = 0; i <= allNodes.length; i++)
  {
    var id = $(allNodes[i]).attr('id');
    if (typeof id !== 'undefined')
      disableTextSelectFor($(allNodes[i]).attr('id'));
  }
  // only required for IE
  $('#'+id).find('*').attr('unselectable','on');
}

function decToHex(dec)
{
  // convert to hex
  var s = Math.round(dec).toString(16);
  // make length of hex always two
  if (s.length == 1)
    return "0"+s;
  else
    return s;
}

function hexToRgb(hex)
{
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
  } : null;
}

function rgbToHex(col)
{
  return "#" + decToHex(col.r) + decToHex(col.g) + decToHex(col.b);
}

function padZero(num)
{
  return num < 10 ? ("0"+num) : (num);
}

/* BROWSER AND OS DETECTION */
var BrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{ 	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			prop: window.opera,
			identity: "Opera",
			versionSearch: "Version"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
		   string: navigator.userAgent,
		   subString: "iPhone",
		   identity: "iPhone/iPod"
    },
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]

};
BrowserDetect.init();
