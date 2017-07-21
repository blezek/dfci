$(document).ready(function() {
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
    var cdrsbDim = ndx.dimension ( dc.pluck ( 'CDRSB' ) );
    // Make CDRSB score the y-axis
    var countPerCdrsb = cdrsbDim.group().reduceCount();

    var cdrsbMax = cdrsbDim.top(1)[0].CDRSB,
        cdrsbMin = cdrsbDim.bottom(1)[0].CDRSB;
    
    var cdrsbChart = dc.barChart('#chart');
    cdrsbChart
      .width(400)
      .height(150)
      .dimension(cdrsbDim)
      .group(countPerCdrsb)
    .x(d3.scale.linear().domain([ cdrsbMin, cdrsbMax ]))
      .elasticX(true)
      .elasticY(true)
      .render();
    
  } );

})
