// Get references to the tbody element, input fields and buttons
var tbody = document.querySelector("tbody");
var datetimeInput = document.querySelector("#datetime");
var cityInput = document.querySelector("#city");
var StateInput = document.querySelector("#state");
var countryInput = document.querySelector("#country");
var shapeInput = document.querySelector("#shape");
var searchBtn = document.querySelector("#search");
var searchBtn1 = document.querySelector("#search1");
var searchBtn2 = document.querySelector("#search2");
var searchBtn3 = document.querySelector("#search3");
var searchBtn4 = document.querySelector("#search4");

// Add an event listener to each search Button, call handleSearchButtonClick  for each one when clicked
searchBtn.addEventListener("click", handleSearchButtonClick);
searchBtn1.addEventListener("click", handleSearchButtonClick1);
searchBtn2.addEventListener("click", handleSearchButtonClick2);
searchBtn3.addEventListener("click", handleSearchButtonClick3);
searchBtn4.addEventListener("click", handleSearchButtonClick4);

// Set filterData to dataSet initially - (the var on the js file). 
var filterData = dataSet;

// renderTable renders the filterdatetime to the tbody
function renderTable() {
  tbody.innerHTML = "";
  for (var i = 0; i < filterData.length; i++) {
    // Get the current objects and its fields. Calling each dictionary object 'ovni'. This comes from the data.js database where
    //the object dataSet holds an array (list) of dictionaries. Each dictionary is an object and I'm calling it ovni. This will
    // loop through each dictionary/object from the variable dataSet and store their keys in the variable fields. 

    var ovni = filterData[i];
    var fields = Object.keys(ovni);
   
    // Create a new row in the tbody, set the index to be i + startingIndex
    // fields are the columns
    var row = tbody.insertRow(i);
    for (var j = 0; j < fields.length; j++) {
      // For every field in the address object, create a new cell and set its inner text to be the current value at the current address's field
      // the variable field will gather the columns names. It will loop through the fields(columns). Example, fields index 0 is datetime.
      var field = fields[j];
      var cell = row.insertCell(j);
      // now i will pass to the cell the ovni object, field values.
      cell.innerText = ovni[field];
    }
  }
}
// create one function for each search at the button click

//search by date/time
function handleSearchButtonClick() {      
  var filterdt = datetimeInput.value.trim();
  
    filterData = dataSet.filter(function(ovni)
    {
        var dt = ovni.datetime;
        return dt === filterdt;
    });
  
renderTable();
}
// search by city
function handleSearchButtonClick2() { 
  var filtercity = cityInput.value.trim().toLowerCase();
  
    filterData = dataSet.filter(function(ovni)
    {
        var dc = ovni.city;
        return dc === filtercity;
    });
  
renderTable();
}
// search by state
function handleSearchButtonClick1() {
  var filterstate = StateInput.value.trim().toLowerCase();
  
    filterData = dataSet.filter(function(ovni)
    {
        var ds = ovni.state;
        return ds === filterstate;
    });
  
renderTable();
}
//search by country
function handleSearchButtonClick3() {
  var filtercountry = countryInput.value.trim().toLowerCase();
  
    filterData = dataSet.filter(function(ovni)
    {
        var dct = ovni.country;
        return dct === filtercountry;
    });
  
renderTable();
}
//search by shape
function handleSearchButtonClick4() {
  var filtershape = shapeInput.value.trim().toLowerCase();
  
    filterData = dataSet.filter(function(ovni)
    {
        var dsp = ovni.shape;
        return dsp === filtershape;
    });
  
renderTable();
}

// Render the table for the first time on page load
// call the function so it can be loaded on the page. 
renderTable();