function Model()
{
  var Model = {};
  
  
  // =========================== H E A D E R =========================== //
  
  /* MEMBER FUNCTIONS */
  
  // constructor
  Model.initModel = initModel;

  // getter
  Model.getYearRange = getYearRange;                // get min[0]/max[1] year of data visualisation
  Model.getDatasetInfo = getDatasetInfo;            // get name of dataset
  Model.getValueRange = getValueRange;              // get min[0]/max[1] value for [dataset][year]
  Model.getValueForRegion = getValueForRegion;      // get value for [region][dataset][year]

  /* MEMBER VARIABLES */

  // range of year
  var myMinYear = 1960;             // min year of visualisation
  var myMaxYear = 2010;             // max year of visualisation

  // array of possible world regions and countries
  var myRegions = null;
  var myCountries = null;

  // array of possible datasets (indicators)
  var myDatasets = null;

  // JSON strings containing the actual data
  var myRegionData = new Object();

  
  // =================== I M P L E M E N T A T I O N =================== //  

  /** CONSTRUCTOR **/
  function initModel()
  {
    // 1. create list of ten most interesting datasets
    // [id,name, description]
    // source: http://data.worldbank.org/indicator
    myDatasets = new Array(
      ['SP.POP.TOTL'],          // total population !!! HAS TO STAY FIRST VALUE IN ARRAY !!!
      ['SP.DYN.LE00.IN'],       // life expectacy
      ['SE.ADT.LITR.ZS'],       // literacy rate
      ['SP.DYN.TFRT.IN'],       // fertility rate
      ['NY.GDP.PCAP.CD'],       // GDP per capita
      ['SE.PRM.CMPT.ZS'],       // primary school completion rate
      ['SE.PRM.ENRL.TC.ZS'],    // pupil-teacher-ratio (primary)  
      ['EN.ATM.CO2E.PC'],       // CO2 emissions per capita
      ['IT.NET.USER.P2'],       // internet users per 100 people
      ['EG.USE.ELEC.KH.PC']     // electric power consumption per capita  
    );

    // HACK FOR NOW: preserve old array
    myRegions = ['AAM', 'LAM', 'EUR', 'RUS', 'ORT', 'SSA', 'EAS', 'SAS', 'SEA', 'OCE'];

    // get list of all world regions and all countries + mapping to world region
    makeCountries();

    // fill datasets with values
    // --> when done, fill region data
    //~ makeDatasets();
  }

  function makeCountries()
  {
    // [iso3, nameEN, code of region]
    myCountries = new Array(
      ['AFG', 'Afghanistan', 'ORT'],
      ['ALB', 'Albania', 'EUR'],
      ['DZA', 'Algeria', 'ORT'],
      ['ASM', 'American Samoa', 'OCE'],
      ['AND', 'Andorra', 'EUR'],
      ['AGO', 'Angola', 'SSA'],
      ['ATG', 'Antigua and Barbuda', 'AAM'],
      ['ARG', 'Argentina', 'LAM'],
      ['ARM', 'Armenia', 'RUS'],
      ['ABW', 'Aruba', 'LAM'],
      ['AUS', 'Australia', 'OCE'],
      ['AUT', 'Austria', 'EUR'],
      ['AZE', 'Azerbaijan', 'RUS'],
      ['BHS', 'Bahamas', 'AAM'],
      ['BHR', 'Bahrain', 'ORT'],
      ['BGD', 'Bangladesh', 'SAS'],
      ['BRB', 'Barbados', 'AAM'],
      ['BLR', 'Belarus', 'EUR'],
      ['BEL', 'Belgium', 'EUR'],
      ['BLZ', 'Belize', 'AAM'],
      ['BEN', 'Benin', 'SSA'],
      ['BMU', 'Bermuda', 'AAM'],
      ['BTN', 'Bhutan', 'SAS'],
      ['BOL', 'Bolivia', 'LAM'],
      ['BIH', 'Bosnia and Herzegovina', 'EUR'],
      ['BWA', 'Botswana', 'SSA'],
      ['BRA', 'Brazil', 'LAM'],
      ['BRN', 'Brunei Darussalam', 'SEA'],
      ['BGR', 'Bulgaria', 'EUR'],
      ['BFA', 'Burkina Faso', 'SSA'],
      ['BDI', 'Burundi', 'SSA'],
      ['KHM', 'Cambodia', 'SEA'],
      ['CMR', 'Cameroon', 'SSA'],
      ['CAN', 'Canada', 'AAM'],
      ['CPV', 'Cape Verde', 'SSA'],
      ['CYM', 'Cayman Islands', 'AAM'],
      ['CAF', 'Central African Republic', 'SSA'],
      ['TCD', 'Chad', 'SSA'],
      ['CHI', 'Channel Islands', 'AAM'],
      ['CHL', 'Chile', 'LAM'],
      ['CHN', 'China', 'EAS'],
      ['COL', 'Colombia', 'LAM'],
      ['COM', 'Comoros', 'SSA'],
      ['COD', 'Democratic Republic of Congo', 'SSA'],
      ['COG', 'Republic of Congo', 'SSA'],
      ['CRI', 'Costa Rica', 'LAM'],
      ['CIV', 'Cote d`Ivoire', 'SSA'],
      ['HRV', 'Croatia', 'EUR'],
      ['CUB', 'Cuba', 'LAM'],
      ['CUW', 'Curacao', 'LAM'],
      ['CYP', 'Cyprus', 'EUR'],
      ['CZE', 'Czech Republic', 'EUR'],
      ['DNK', 'Denmark', 'EUR'],
      ['DJI', 'Djibouti', 'SSA'],
      ['DMA', 'Dominica', 'AAM'],
      ['DOM', 'Dominican Republic', 'LAM'],
      ['ECU', 'Ecuador', 'LAM'],
      ['EGY', 'Egypt', 'ORT'],
      ['SLV', 'El Salvador', 'LAM'],
      ['GNQ', 'Equatorial Guinea', 'SSA'],
      ['ERI', 'Eritrea', 'SSA'],
      ['EST', 'Estonia', 'EUR'],
      ['ETH', 'Ethiopia', 'SSA'],
      ['FRO', 'Faeroe Islands', 'EUR'],
      ['FJI', 'Fiji', 'OCE'],
      ['FIN', 'Finland', 'EUR'],
      ['FRA', 'France', 'EUR'],
      ['PYF', 'French Polynesia', 'OCE'],
      ['GAB', 'Gabon', 'SSA'],
      ['GMB', 'Gambia, The', 'SSA'],
      ['GEO', 'Georgia', 'RUS'],
      ['DEU', 'Germany', 'EUR'],
      ['GHA', 'Ghana', 'SSA'],
      ['GRC', 'Greece', 'EUR'],
      ['GRL', 'Greenland', 'AAM'],
      ['GRD', 'Grenada', 'AAM'],
      ['GUM', 'Guam', 'OCE'],
      ['GTM', 'Guatemala', 'LAM'],
      ['GIN', 'Guinea', 'SSA'],
      ['GNB', 'Guinea-Bissau', 'SSA'],
      ['GUY', 'Guyana', 'AAM'],
      ['HTI', 'Haiti', 'LAM'],
      ['HND', 'Honduras', 'LAM'],
      ['HKG', 'Hong Kong', 'EAS'],
      ['HUN', 'Hungary', 'EUR'],
      ['ISL', 'Iceland', 'EUR'],
      ['IND', 'India', 'SAS'],
      ['IDN', 'Indonesia', 'SEA'],
      ['IRN', 'Iran', 'ORT'],
      ['IRQ', 'Iraq', 'ORT'],
      ['IRL', 'Ireland', 'EUR'],
      ['IMN', 'Isle of Man', 'EUR'],
      ['ISR', 'Israel', 'ORT'],
      ['ITA', 'Italy', 'EUR'],
      ['JAM', 'Jamaica', 'AAM'],
      ['JPN', 'Japan', 'EAS'],
      ['JOR', 'Jordan', 'ORT'],
      ['KAZ', 'Kazakhstan', 'RUS'],
      ['KEN', 'Kenya', 'SSA'],
      ['KIR', 'Kiribati', 'OCE'],
      ['PRK', 'North Korea', 'EAS'],
      ['KOR', 'South Korea', 'EAS'],
      ['KSV', 'Kosovo', 'EUR'],
      ['KWT', 'Kuwait', 'ORT'],
      ['KGZ', 'Kyrgyz Republic', 'RUS'],
      ['LAO', 'Laos', 'SEA'],
      ['LVA', 'Latvia', 'EUR'],
      ['LBN', 'Lebanon', 'ORT'],
      ['LSO', 'Lesotho', 'SSA'],
      ['LBR', 'Liberia', 'SSA'],
      ['LBY', 'Libya', 'ORT'],
      ['LIE', 'Liechtenstein', 'EUR'],
      ['LTU', 'Lithuania', 'EUR'],
      ['LUX', 'Luxembourg', 'EUR'],
      ['MAC', 'Macao', 'EAS'],
      ['MKD', 'Macedonia', 'EUR'],
      ['MDG', 'Madagascar', 'SSA'],
      ['MWI', 'Malawi', 'SSA'],
      ['MYS', 'Malaysia', 'SEA'],
      ['MDV', 'Maldives', 'SAS'],
      ['MLI', 'Mali', 'SSA'],
      ['MLT', 'Malta', 'EUR'],
      ['MHL', 'Marshall Islands', 'OCE'],
      ['MRT', 'Mauritania', 'SSA'],
      ['MUS', 'Mauritius', 'SSA'],
      ['MEX', 'Mexico', 'LAM'],
      ['FSM', 'Micronesia', 'OCE'],
      ['MDA', 'Moldova', 'EUR'],
      ['MCO', 'Monaco', 'EUR'],
      ['MNG', 'Mongolia', 'EAS'],
      ['MNE', 'Montenegro', 'EUR'],
      ['MAR', 'Morocco', 'ORT'],
      ['MOZ', 'Mozambique', 'SSA'],
      ['MMR', 'Myanmar', 'SEA'],
      ['NAM', 'Namibia', 'SSA'],
      ['NPL', 'Nepal', 'SAS'],
      ['NLD', 'Netherlands', 'EUR'],
      ['NCL', 'New Caledonia', 'OCE'],
      ['NZL', 'New Zealand', 'OCE'],
      ['NIC', 'Nicaragua', 'LAM'],
      ['NER', 'Niger', 'SSA'],
      ['NGA', 'Nigeria', 'SSA'],
      ['MNP', 'Northern Mariana Islands', 'OCE'],
      ['NOR', 'Norway', 'EUR'],
      ['OMN', 'Oman', 'ORT'],
      ['PAK', 'Pakistan', 'SAS'],
      ['PLW', 'Palau', 'OCE'],
      ['PAN', 'Panama', 'LAM'],
      ['PNG', 'Papua New Guinea', 'OCE'],
      ['PRY', 'Paraguay', 'LAM'],
      ['PER', 'Peru', 'LAM'],
      ['PHL', 'Philippines', 'SEA'],
      ['POL', 'Poland', 'EUR'],
      ['PRT', 'Portugal', 'EUR'],
      ['PRI', 'Puerto Rico', 'AAM'],
      ['QAT', 'Qatar', 'ORT'],
      ['ROU', 'Romania', 'EUR'],
      ['RUS', 'Russia', 'RUS'],
      ['RWA', 'Rwanda', 'SSA'],
      ['WSM', 'Samoa', 'OCE'],
      ['SMR', 'San Marino', 'EUR'],
      ['STP', 'Sao Tome and Principe', 'SSA'],
      ['SAU', 'Saudi Arabia', 'ORT'],
      ['SEN', 'Senegal', 'SSA'],
      ['SRB', 'Serbia', 'EUR'],
      ['SYC', 'Seychelles', 'SSA'],
      ['SLE', 'Sierra Leone', 'SSA'],
      ['SGP', 'Singapore', 'SEA'],
      ['SXM', 'Sint Maarten', 'LAM'],
      ['SVK', 'Slovak Republic', 'EUR'],
      ['SVN', 'Slovenia', 'EUR'],
      ['SLB', 'Solomon Islands', 'OCE'],
      ['SOM', 'Somalia', 'SSA'],
      ['ZAF', 'South Africa', 'SSA'],
      ['SSD', 'South Sudan', 'SSA'],
      ['ESP', 'Spain', 'EUR'],
      ['LKA', 'Sri Lanka', 'SAS'],
      ['KNA', 'St. Kitts and Nevis', 'AAM'],
      ['LCA', 'St. Lucia', 'AAM'],
      ['MAF', 'St. Martin', 'LAM'],
      ['VCT', 'St. Vincent and the Grenadines', 'AAM'],
      ['SDN', 'Sudan', 'SSA'],
      ['SUR', 'Suriname', 'LAM'],
      ['SWZ', 'Swaziland', 'SSA'],
      ['SWE', 'Sweden', 'EUR'],
      ['CHE', 'Switzerland', 'EUR'],
      ['SYR', 'Syria', 'ORT'],
      ['TJK', 'Tajikistan', 'RUS'],
      ['TZA', 'Tanzania', 'SSA'],
      ['THA', 'Thailand', 'SEA'],
      ['TLS', 'Timor-Leste', 'SEA'],
      ['TGO', 'Togo', 'SSA'],
      ['TON', 'Tonga', 'OCE'],
      ['TTO', 'Trinidad and Tobago', 'AAM'],
      ['TUN', 'Tunisia', 'ORT'],
      ['TUR', 'Turkey', 'ORT'],
      ['TKM', 'Turkmenistan', 'RUS'],
      ['TCA', 'Turks and Caicos Islands', 'AAM'],
      ['TUV', 'Tuvalu', 'OCE'],
      ['UGA', 'Uganda', 'SSA'],
      ['UKR', 'Ukraine', 'EUR'],
      ['ARE', 'United Arab Emirates', 'ORT'],
      ['GBR', 'United Kingdom', 'EUR'],
      ['USA', 'United States of America', 'AAM'],
      ['URY', 'Uruguay', 'LAM'],
      ['UZB', 'Uzbekistan', 'RUS'],
      ['VUT', 'Vanuatu', 'OCE'],
      ['VEN', 'Venezuela', 'LAM'],
      ['VNM', 'Vietnam', 'SEA'],
      ['VIR', 'Virgin Islands (U.S.)', 'AAM'],
      ['PSE', 'West Bank and Gaza', 'ORT'],
      ['YEM', 'Yemen', 'ORT'],
      ['ZMB', 'Zambia', 'SSA'],
      ['ZWE', 'Zimbabwe', 'SSA']
    );

    // for each country, add iso2 code as country[3]
    $.ajax(
      {
        dataType: 'json',
        url: 'http://api.worldbank.org/countries/all?per_page=500&format=jsonP&prefix=?',
        async: false,
        success: function(data)
          {
            // for each country in return array
            $.each(data[1], function(key, val)
              {
                // get id and iso 2 code from country
                var id = val['id'];
                var iso2 = val['iso2Code'];

                // find id in countries and set iso2 code
                for (var i in myCountries)
                {
                  if (myCountries[i][0] == id)
                  {
                    myCountries[i].push(iso2);
                    break;
                  }
                }
              }
            );

            // proceed to next step!
            makeRegions();
          }
      }
    );
  }

  function makeRegions()
  {
    // [code, nameEN, countries[]]
    myRegions = new Array(
      ['AAM', 'Anglo America'],
      ['LAM', 'Latin America'],
      ['EUR', 'Europe'],
      ['RUS', 'Russia'],
      ['ORT', 'Orient'],
      ['SSA', 'Sub Sahara'],
      ['EAS', 'East Asia'],
      ['SAS', 'South Asia'],
      ['SEA', 'South East Asia'],
      ['OCE', 'Oceania']
    );

    /* get all countries belonging in this region */

    // prepare array storing all countries
    for (var i in myRegions)
      myRegions[i].push(new Array());

    // for each country take associated world region and add country code into its list
    for (var ctr in myCountries)
    {
      var ctrCode = myCountries[ctr][0];
      var regCode = myCountries[ctr][2];
      for (var reg in myRegions)
      {
        if (myRegions[reg][0] == regCode)
        {
          myRegions[reg][2].push(ctrCode);
          break;
        }
      }
    }

    // proceed to next step!
    makeDatasets();
  }


  function makeDatasets()
  {
    // init array that states if dataset information is loaded
    var dsLoaded = new Array();
    var len = myDatasets.length;
    for (var i = 0; i < len; i++)
      dsLoaded.push(false);
    
    for (var i in myDatasets)
    {
      var indName = myDatasets[i][0];
      var url = 'http://api.worldbank.org/indicator/' + indName + '?per_page=10000&format=jsonP&prefix=?';

      // IMPORTANT (!!!)
      // call getJSON in new scope (function), handing loop variable i into it
      // necessary so that variable i is stores. Very important to know!
      (function(i)
        {
          $.getJSON(url, function(data)
            {
              // extract name
              myDatasets[i][1] = data[1][0]['name'];
              // extract info text
              myDatasets[i][2] = data[1][0]['sourceNote'];
              // state dataset is loaded successfully
              dsLoaded[i] = true;
              // test: all datasets loaded successfully?
              var succLoaded = true;
              for (var j in dsLoaded)
              {
                if (!dsLoaded[j])
                {
                  succLoaded = false;
                  break;
                }
              }
              // if so, proceed to nextStep
              if (succLoaded)
                loadPopulationData();
            }
          );
        }
      )(i);
    }
  }

  function loadPopulationData()
  {
    // init region data object
    // [dataset][year][region] = value;
    // for each dataset
    for (var ds in myDatasets)
    {
      var dsName = myDatasets[ds][0];
      myRegionData[dsName] = new Object();
      // for each year
      for (var year = myMinYear; year <= myMaxYear; year++)
      {
        myRegionData[dsName][year] = new Object();
        // for each region
        for (var reg in myRegions)
        {
          var regName = myRegions[reg][0];
          myRegionData[dsName][year][regName] = 0;
        }
      }
    }
    
    var dsName = myDatasets[0][0];
    var url = 'http://api.worldbank.org/countries/all/indicators/' + dsName + '?per_page=15000&date=1960:2010&format=jsonP&prefix=?';

    // IMPORTANT (!!!)
    // call getJSON in new scope (function), handing loop variable i into it
    // necessary so that variable i is stored. Very important to know!
    (function(dsName)
      {
        $.getJSON(url, function(data)
          {
            var start = 1632;         // hack: first array of actual country (AFG)
            var end = data[1].length;

            // for each element in array
            for (var i = start; i < end; i++)
            {
              // get country iso2
              var iso2 = data[1][i]['country']['id'];
              
              // transfer to region id
              var regName = -1;
              for (var j in myCountries)
              {
                if (myCountries[j][3] == iso2)
                {
                  regName = myCountries[j][2];
                  break;
                }
              }
              if (regName == -1) continue;

              // get year
              var year = data[1][i]['date'];

              // get value + error handling (set to 0 if not given)
              var value = parseFloat(data[1][i]['value']);
              if(isNaN(value)) value = 0;

              // accumulate population for that region
              myRegionData[dsName][year][regName] += value;
            }

            // proceed to next step
            loadAllData();
            // init controller now, because first dataset is loaded!
            Controller.initController();
          }
        );
      }
    )(dsName);
  }

  function loadAllData()
  {
    var start = 1;
    var len = myDatasets.length;
    var namePopDs = myDatasets[0][0];

    // for ech remaining dataset
    for (var i = start; i < len; i++)
    {
      var dsName = myDatasets[i][0];
      var url = 'http://api.worldbank.org/countries/all/indicators/' + dsName + '?per_page=15000&date=1960:2010&format=jsonP&prefix=?';

      // IMPORTANT (!!!)
      // call getJSON in new scope (function), handing loop variable i into it
      // necessary so that variable i is stored. Very important to know!
      (function(dsName)
        {
          $.getJSON(url, function(data)
            {
              var start = 1632;         // hack: first array of actual country (AFG)
              var end = data[1].length;

              // store relevant population for each year and each region
              var relevantPop = new Object();
              // for each year
              for (var year = myMinYear; year <= myMaxYear; year++)
              {
                relevantPop[year] = new Object();
                // for each region
                for (var reg in myRegions)
                {
                  var regName = myRegions[reg][0];
                  relevantPop[year][regName] = 0;
                }
              }
              

              // for each element in array
              for (var i = start; i < end; i++)
              {
                // get country iso2
                var iso2 = data[1][i]['country']['id'];
                
                // transfer to region id
                var regName = -1;
                for (var j in myCountries)
                {
                  if (myCountries[j][3] == iso2)
                  {
                    regName = myCountries[j][2];
                    break;
                  }
                }
                if (regName == -1) continue;

                // get year
                var year = data[1][i]['date'];

                // get value + error handling (set to 0 if not given)
                var value = parseFloat(data[1][i]['value']);
                if (isNaN(value)) value = 0;

                // accumulate value (value * pop)
                myRegionData[dsName][year][regName] += value * myRegionData[namePopDs][year][regName];

                // accumulate relevant population
                if (value > 0)
                  relevantPop[year][regName] += myRegionData[namePopDs][year][regName];
              }

              // get weightes values for each year
              for (var year = myMinYear; year < myMaxYear; year++)
              {
                // for each region
                for (var reg in myRegions)
                {
                  var regName = myRegions[reg][0];
                  myRegionData[dsName][year][regName] /= relevantPop[year][regName];
                }
              }
              console.log(myRegionData)
            }
          );
        }
      )(dsName);
    }
  }

  /** GETTER **/
  function getYearRange()
  {
    return new Array(myMinYear, myMaxYear);
  }
  
  function getDatasetInfo(inDsId)
  {
    // check if dataset name is in list of possible datasets
    var index = -1;
    for (var i in myDatasets)
    {
      if (myDatasets[i][0] == inDsId)
        index = i;
        break;
    }
    
    // error handling: if element not in the list, throw error and set first dataset instead
    if (index == -1)
    {
      console.log("wrong dataset name! choose population instead");
      index = 0;
    }


    return myDatasets[index];
  }

  function getValueRange(inDsId, inYear)
  {
    // get all values of this dataset
    var dsName = getDatasetInfo(inDsId)[0];
    var values = myRegionData[dsName];

    // calculate min/max values by iterating through array
    var outMin =  99999999999.99;
    var outMax = -99999999999.99;

    // if no year given to function, assume that total min/max is asked
    if (typeof(inYear) === 'undefined')
    {
      // for each year
      for (var year = myMinYear; year < myMaxYear; year++)
      {
        // for each region
        for (var reg in myRegions)
        {
          var regName = myRegions[reg][0];
          // get value
          var val = values[year][regName];
          if (isNaN(val)) val = 0;
          // clip min/max values (can be optimised...)
          outMin = Math.min(outMin, val);
          outMax = Math.max(outMax, val);
        }
      }
    }

    // if year given to function, calculate min/max for this very year
    else
    {
      // test if year is in range -> if not, set to min year (do not know why, just error handling...)
      if (inYear < myMinYear || inYear > myMaxYear)
        inYear = myMinYear;
      
      // for each region
      for (var reg in myRegions)
      {
        var regName = myRegions[reg][0];
        // get value
        var val = values[inYear][regName];
        // clip min/max values (can be optimised...)
        outMin = Math.min(outMin, val);
        outMax = Math.max(outMax, val);
      }
    }

    return new Array(outMin, outMax);
  }
  
  function getValueForRegion(inDsId, inYear, inRegId)
  {
    // error handling: if region is not in list, throw error
    //~ if (myRegions.indexOf(myRegions[inRegId]) == -1)
    //~ {
      //~ console.log("Error! Region " + inRegId + " does not exist!");
      //~ return null;
    //~ }
    //~ // error handling: if dataset is not in list, throw error
    //~ if (myDatasets.indexOf(inDsName) == -1)
    //~ {
      //~ console.log("Error! Dataset " + inDsName + " does not exist!");
      //~ return null;
    //~ }
    //~ 
    // if region, year and dataset are valid return this very value
    var outDsName = myDatasets[inDsId][0];
    var outRegName = myRegions[inRegId][0];
    
    return myRegionData[outDsName][inYear][outRegName];
  }


  return Model;
}
