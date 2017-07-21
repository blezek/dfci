$(document).ready(function() {
  var data = [
    {date: "2011-11-14T16:17:54Z", quantity: 2, total: 190, tip: 100, type: "tab"},
    {date: "2011-11-14T16:20:19Z", quantity: 2, total: 190, tip: 100, type: "tab"},
    {date: "2011-11-14T16:28:54Z", quantity: 1, total: 300, tip: 200, type: "visa"},
    {date: "2011-11-14T16:30:43Z", quantity: 2, total: 90, tip: 0, type: "tab"},
    {date: "2011-11-14T16:48:46Z", quantity: 2, total: 90, tip: 0, type: "tab"},
    {date: "2011-11-14T16:53:41Z", quantity: 2, total: 90, tip: 0, type: "tab"},
    {date: "2011-11-14T16:54:06Z", quantity: 1, total: 100, tip: 0, type: "cash"},
    {date: "2011-11-14T16:58:03Z", quantity: 2, total: 90, tip: 0, type: "tab"},
    {date: "2011-11-14T17:07:21Z", quantity: 2, total: 90, tip: 0, type: "tab"},
    {date: "2011-11-14T17:22:59Z", quantity: 2, total: 90, tip: 0, type: "tab"},
    {date: "2011-11-14T17:25:45Z", quantity: 2, total: 200, tip: 0, type: "cash"},
    {date: "2011-11-14T17:29:52Z", quantity: 1, total: 200, tip: 100, type: "visa"}
  ];

  var ndx = crossfilter ( data );

  var typeDim = ndx.dimension ( dc.pluck ( 'type' ) );
  var countPerType = typeDim.group().reduceCount()
  
  var cdrsbChart = dc.pieChart('#chart');
  cdrsbChart
    .width(150)
    .height(150)
    .innerRadius(20)
    .dimension(typeDim)
    .group ( countPerType );

  dc.renderAll();

  return  
  // Pull in the ADNI scores
  d3.csv ( "ADNIMERGE.csv", function (data) {
  console.log ( data[0].CDRSB )
  var ndx = crossfilter(data);

  var parseDate = d3.time.format("%Y-%m-%d").parse;
  var parseTimestamp = d3.time.format("%Y-%m-%d %h:%M:%s.$L").parse;
  // Parse dates properly
  data.forEach(function(d){
    d.EXAMDATE = parseDate ( d.EXAMDATE );
    d.EXAMDATE_bl = parseDate ( d.EXAMDATE_bl );
    d.update_stamp = parseTimestamp ( d.update_stamp );
  });
  
  var ageDim = ndx.dimension ( dc.pluck('AGE') );
  var cdrsbDim = ndx.dimension ( function(d){
    return d.CDRSB;
  } );
  // Make CDRSB score the y-axis
  var countPerCrdsb = cdrsbDim.group().reduceCount();


  var cdrsbChart = dc.pieChart('#chart');
  cdrsbChart
    .width(150)
    .height(150)
    .innerRadius(20);
  
} );

})
