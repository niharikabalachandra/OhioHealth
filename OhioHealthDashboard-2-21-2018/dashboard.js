var parseDate = d3.timeParse("%m/%d/%Y")

d3.csv("SentimentBackup.csv")
    .row(function(d){return {month: parseDate(d.Date), title: d.Title, hospital: d.Hospital, s: parseFloat(d.Sentiment)};})
    .get(function(error, data){

//--------------------------------------------------------------------------------------------------------------------------

      var height = 250;
      var width = 450;

      //var max = d3.max(data,function(d){ return d.sentiment; });
      var minDate = d3.min(data,function(d){ return d.month; });
      var maxDate = d3.max(data,function(d){ return d.month; });

      var y = d3.scaleLinear()
                  .domain([0,2])
                  .range([height,0]);
      var x = d3.scaleTime()
                  .domain([minDate,maxDate])
                  .range([0,width]);
      var yAxis = d3.axisLeft(y);
      var xAxis = d3.axisBottom(x);
          xAxis.tickFormat(d3.timeFormat('%b %y'));

      var radius = d3.scaleSqrt()
                    .domain([0,2])
		                .range([2,5]);

      var color = d3.scaleOrdinal(d3.schemeCategory20);

      var svg = d3.select("body").append("svg").attr("height","100%").attr("width","100%");

      var margin = {left:30,right:50,top:400,bottom:0};

      var chartGroup = svg.append("g")
                  .attr("class","chartGroup")
                  .attr("transform","translate("+margin.left+","+margin.top+")");

      var bubble = chartGroup.selectAll('.bubble')
			.data(data)
			.enter().append('circle')
			.attr('class', 'bubble')
			.attr('cx', function(d){return x(d.month);})
			.attr('cy', function(d){ return y(d.s); })
			.attr('r', function(d){ return radius(d.s); })
			.style('fill', function(d){ return color(d.hospital); });

      bubble.append('title')
			.attr('x', function(d){ return x(d.s); })
			.text(function(d){
				return d.hospital;
			});

		// adding label. For x-axis, it's at (10, 10), and for y-axis at (width, height-10).
		chartGroup.append('text')
			.attr('x', 10)
			.attr('y', 2)
			.attr('class', 'label')
			.text('News Sentiment Score');


		chartGroup.append('text')
			.attr('x', width+35)
			.attr('y', height - 2)
			.attr('text-anchor', 'end')
			.attr('class', 'label')
			.text('Time');

      var legend = chartGroup.selectAll('legend')
			.data(color.domain())
			.enter().append('g')
			.attr('class', 'legend')
			.attr('transform', function(d,i){ return 'translate(0,' + i * 20 + ')'; });

		// give x value equal to the legend elements.
		// no need to define a function for fill, this is automatically fill by color.
		legend.append('rect')
			.attr('x', width+5)
			.attr('width', 18)
			.attr('height', 18)
			.style('fill', color);

		// add text to the legend elements.
		// rects are defined at x value equal to width, we define text at width - 6, this will print name of the legends before the rects.
		legend.append('text')
			.attr('x', width + 30)
			.attr('y', 9)
			.attr('dy', '.35em')
			.style('text-anchor', 'start')
			.text(function(d){ return d; });

    var toggleSelected = true;
		// d3 has a filter fnction similar to filter function in JS. Here it is used to filter d3 components.
		legend.on('click', function(type){
      if(toggleSelected == true) {
        			d3.selectAll('.bubble')
        				.style('opacity', 0.15)
        				.filter(function(d){
        					return d.hospital == type;
        				})
        				.style('opacity', 1);
                toggleSelected = false;
      }
      else {
              d3.selectAll('.bubble')
               .style('opacity', 1);
               toggleSelected = true;

           }

		})

      chartGroup.append("g").attr("class","x axis").attr("transform","translate(0,"+height+")").call(xAxis);
      chartGroup.append("g").attr("class","y axis").call(yAxis);

//-------------------------------------------------------------------------------------------------------------------------------

var parseDate2 = d3.timeParse("%y-%b")

//var height = 300;
//var width = 500;
var margin2 = {left:700,right:50,top:400,bottom:0};

//var svg = d3.select("body").append("svg").attr("height","100%").attr("width","100%");

var chartGroup2 = svg.append("g")
            .attr("class","chartGroup2")
            .attr("transform","translate("+margin2.left+","+margin2.top+")");

// set x scale
var x = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.05)
    .align(0.1);

// set y scale
var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var color = d3.scaleOrdinal(d3.schemeCategory20);

d3.csv("SentimentStacked.csv", function(d, i, columns) {
  for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];

  d.total = t;
  return d;
}, function(error, data) {
  if (error) throw error;

  var keys = data.columns.slice(1);

  //data.sort(function(a, b) { return b.total - a.total; });
  x.domain(data.map(function(d) { return parseDate2(d.Date2); }));
  y.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
  color.domain(keys);

  var stack= chartGroup2.append("g")
                .attr('class', 'stack-0')
                .selectAll("g")
                .data(d3.stack().keys(keys)(data))
                .enter().append("g")
                .attr('class', function(d) { return d.key; })
                .attr("fill", function(d) { return color(d.key); })
                .selectAll("rect")
                .data(function(d) { return d; })
                .enter().append("rect")
                  .attr("x", function(d) { return x(parseDate2(d.data.Date2)); })
                  .attr("y", function(d) { return y(d[1]); })
                  .attr("height", function(d) { return y(d[0]) - y(d[1]); })
                  .attr("width", x.bandwidth())
                .append('title')
                  .attr('x', function(d){ return x((parseDate2(d.data.Date2))); })
                  .text(function(d){
                    return d[1]-d[0] + " News Articles";
                  });

                /*.on("mouseover", function() { tooltip.style("display", null); })
                .on("mouseout", function() { tooltip.style("display", "none"); })
                .on("mousemove", function(d) {
                  console.log(d);
                  var xPosition = d3.mouse(this)[0] - 15;
                  var yPosition = d3.mouse(this)[1] - 25;
                  tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
                  tooltip.select("text").text(d[1]-d[0]);
                })*/


      chartGroup2.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickFormat(d3.timeFormat('%b %y')));

        chartGroup2.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y).ticks(null, "s"))
          .append("text")
            .attr("x", 2)
            .attr("y", y(y.ticks().pop()) + 0.5)
            .attr("dy", "0.32em")
            .attr("fill", "#000")
            .attr("font-weight", "bold")
            .attr("text-anchor", "start");


            chartGroup2.append('text')
        			.attr('x', 10)
        			.attr('y', 2)
        			.attr('class', 'label')
        			.text('News Mentions');


        		chartGroup2.append('text')
        			.attr('x', width + 35)
        			.attr('y', height - 2)
        			.attr('text-anchor', 'end')
        			.attr('class', 'label')
        			.text('Time');

        var legend2 = chartGroup2.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr('class', 'legend')
            .attr("text-anchor", "start")
          .selectAll("g")
          .data(keys.slice())
          .enter().append("g")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        legend2.append("rect")
            .attr("x", width+5)
            .attr("width", 18)
            .attr("height", 18)
            .attr("fill", color);

        legend2.append("text")
            .attr("x", width + 30)
            .attr("y", 9.5)
            .attr("dy", "0.32em")
            .text(function(d) { return d; });

  /*          var toggleSelected2 = true;

        legend2.on('click', function(type){
          if(toggleSelected2 == true ) {

                  d3.selectAll('stack')
                    .style('opacity', 0.15)
                    .filter(function(d){

                      return keys.slice() == type;
                    })
                    .style('opacity', 1);
                    toggleSelected2 = false;
          }
          else {
                  d3.selectAll('stack')
                   .style('opacity', 1);
                   toggleSelected = true;

               }

            })*/


      });

        // Prep the tooltip bits, initial display is hidden
        /*var tooltip = chartGroup2.append("g")
          .attr("class", "tooltip")
          .style("display", "none")
          .style("zIndex" , "20");

        tooltip.append("rect")
          .attr("width", 60)
          .attr("height", 20)
          .attr("fill", "white")
          .style("opacity", 0.5);

        tooltip.append("text")
          .attr("x", 30)
          .attr("dy", "1.2em")
          .style("text-anchor", "end")
          .attr("font-size", "12px")
          .attr("font-weight", "bold");*/

//---------------------------------------------------------------------------------------------------------------------------------


var margin3 = {left:0,right:10,top:60,bottom:0};//350left

var padding = 20
var height3= 300
var width3= 500
var color3 = d3.scaleThreshold()
    .domain([0.028, 0.038, 0.048, 0.058, 0.068, 0.078])
    .range(['#1f77b4', '#2c9cdb', '#aec7e8', '#ffbb78','#f99f5d','#ff7f0e',  'f7f7f7'])
    //.range(['#4d9221', '#a1d76a', '#e6f5d0', '#f7f7f7', '#fde0ef', '#e9a3c9', '#c51b7d'])

var legendLabel=['No activity','Sporadic','Local Activity','Regional','Intermediate','widespread','No Report']
var legendFill=['#1f77b4', '#2c9cdb', '#aec7e8', '#ffbb78','#f99f5d','#ff7f0e',  'f7f7f7']

var projection = d3.geoAlbers()
    .precision(0)
    .scale(height3 * 2).translate([width3 / 2, height3 / 2])

var path = d3.geoPath().projection(projection)

var chartGroup3 = svg.append("g")
            .attr("class","chartGroup3")
            .attr("transform","translate("+margin3.left+","+margin3.top+")");

d3.queue()
    .defer(d3.csv, 'data.csv', function (d) {
        return {
            id: +(d.state + d.county),
            state: d.state,
            county: d.county,
            unemployment: +d.unemployment
        }
    })
    .defer(d3.json, 'us-states.json')
    .defer(d3.json, 'us-counties.json')
    .awaitAll(initialize)

    function initialize(error, results) {
        if (error) { throw error }

        var data = results[0]
        var states = topojson.feature(results[1], results[1].objects.states).features
        var counties = topojson.feature(results[2], results[2].objects.counties).features

        states.forEach(function (f) {
            f.properties = data.find(function (d) { return d.id === f.id })
        })

        counties.forEach(function (f) {
            f.properties = data.find(function (d) { return d.id === f.id }) || {}
        })

        var statePaths = chartGroup3.selectAll('.state')
            .data(states)
            .enter().append('path')
            .attr('class', 'state')
            .attr('d', path)
            .style('fill', function (d) { return color3(d.properties.unemployment) })
            .on('click', function (d) { stateZoom(d.id) })

        function usZoom() {
            var t = d3.transition().duration(800)

            projection.scale(height3 * 2).translate([width3 / 2, height3 / 2])

            statePaths.transition(t)
                .attr('d', path)
                .style('fill', function (d) { return color3(d.properties.unemployment) })

            chartGroup3.selectAll('.county')
                .data([])
                .exit().transition(t)
                .attr('d', path)
                .style('opacity', 0)
                .remove()
        }

        function stateZoom(id) {
            var state = states.find(function (d) { return d.id === id })
            var stateCounties = counties.filter(function (d) {
                return d.id > id && d.id < id + 1000
            })

            var t = d3.transition().duration(800)

            var countyPaths = chartGroup3.selectAll('.county')
                .data(stateCounties, function (d) { return d.id })

            var enterCountyPaths = countyPaths.enter().append('path')
                .attr('class', 'county')
                .attr('d', path)
                .style('fill', function (d) { return color3(d.properties.unemployment) })
                .style('opacity', 0)
                .on('click', function () { usZoom() })

            projection.fitExtent(
                [[margin3.left, margin3.top], [width3 - padding, height3 - padding]],
                state
            )

            statePaths.transition(t)
                .attr('d', path)
                .style('fill', '#444')

            enterCountyPaths.transition(t)
                .attr('d', path)
                .style('opacity', 1)

            countyPaths.exit().transition(t)
                .attr('d', path)
                .style('opacity', 0)
                .remove()
        }
    }

    var legend3 = chartGroup3.append("g")
        .attr("class","legend3")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr('class', 'legend')
        .attr("text-anchor", "end")
      .selectAll("g")
      .data(legendLabel)
      .enter().append("g")
        .attr("transform", function(d, i) { return "translate(-20," + (75+ i * 20) + ")"; });

        //legend3.attr("transform","translate("+margin3.left+","+margin3.top+")");
        legend3.append('rect')
          .attr('x', width3 +3)
          .attr('width', 18)
          .attr('height', 18)
          .style('fill', function(d, i){return legendFill[i] ;});

        legend3.append('text')
          .attr('x', width3 + 28)
          .attr('y', 9)
          .attr('dy', '.35em')
          .style('text-anchor', 'start')
          .text(function(d){ return d; });

          chartGroup3.append('text')
            .attr('x', width3- 125)
            .attr('y', 2)
            .attr('class', 'label')
            .text('2018 Flu Activity');

//----------------------------------------------------------------------------------------------------------------------------------------

var margin_logo = {left:1153,right:10,top:-5,bottom:0};
var logo = svg.append('svg:image')
							    .attr("xlink:href","ohiohealth_small.svg")
							    .attr('id', 'logo')
							    .attr('width', 180)
							    .attr('height', 100)
                  .attr("transform","translate("+margin_logo.left+","+margin_logo.top+")");;

//---------------------------------------------------------------------------------------------------------------------------------------------

var width4 = 450
var height4 = 250

var margin4 = {left:700,right:10,top:60,bottom:0};

var chartGroup4 = svg.append("g")
            .attr("class","chartGroup4")
            .attr("transform","translate("+margin4.left+","+margin4.top+")");

  chartGroup4.selectAll('.slider').attr("transform","translate("+margin4.left+","+margin4.top+")");


  //width4 = width4 - margin4.left - margin4.right;
  //height4 = height4 - margin4.top - margin4.bottom;

  var data = {};

  var x_scale = d3.scaleBand()
      .rangeRound([0, width4])
      .padding(0.1);

  var y_scale = d3.scaleLinear()
      .range([height4, 0]);

  var colour_scale4 = d3.scaleQuantile()
      .range(["#1f77b4", "#2c9cdb", "#45b6dd", "#aacbe8", "#ffbb78", "#fcddc5", "#efb38b", "#f29251", "#ff730b"]);

  var y_axis = d3.axisLeft(y_scale);
  var x_axis = d3.axisBottom(x_scale);

  chartGroup4.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height4 + ')');

  chartGroup4.append('g')
      .attr('class', 'y axis');

  function draw(year) {

      var csv_data4 = data[year];

      var t4 = d3.transition()
          .duration(2000);

      var months4 = csv_data4.map(function(d) {
        return d.month4;
    });
    x_scale.domain(months4);

    var max_value4 = d3.max(csv_data4, function(d) {
        return +d.value;
    });

    y_scale.domain([0, max_value4]);
    colour_scale4.domain([0, max_value4]);

    var bars4 = chartGroup4.selectAll('.bar')
        .data(csv_data4)

    bars4
            .exit()
            .remove();

        var new_bars4 = bars4
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', function(d) {
                return x_scale(d.month4);
            })
            .attr('width', x_scale.bandwidth())
            .attr('y', height4)
            .attr('height', 0)

            new_bars4.append('title')
      			.attr('x', function(d){ return x_scale(d.month4); })
      			.text(function(d){
      				return +d.value + " cases";
      			});

            new_bars4.merge(bars4)
                .transition(t4)
                .attr('y', function(d) {
                    return y_scale(+d.value);
                })
                .attr('height', function(d) {
                    return height4 - y_scale(+d.value)
                })
                .attr('fill', function(d) {
                    return colour_scale4(+d.value);
                })

             chartGroup4.select('.x.axis')
                .call(x_axis);

             chartGroup4.select('.y.axis')
                .transition(t4)
                .call(y_axis);

            chartGroup4.append('text')
              .attr('x', 10)
              .attr('y', 0)
              .attr('class', 'label')
              .text('Flu Related Hospitalizations in Ohio');


            chartGroup4.append('text')
              .attr('x', width + 35)
              .attr('y', height - 2)
              .attr('text-anchor', 'end')
              .attr('class', 'label')
              .text('Time');

        }

        d3.queue()
            .defer(d3.csv, 'monthly_data_2014.csv')
            .defer(d3.csv, 'monthly_data_2013.csv')
            .defer(d3.csv, 'monthly_data_2012.csv')
            .defer(d3.csv, 'monthly_data_2011.csv')
            .defer(d3.csv, 'monthly_data_2010.csv')
            .defer(d3.csv, 'monthly_data_2009.csv')
            .await(function(error, d2017, d2016, d2015, d2014, d2013, d2012) {
                data['2012'] = d2012;
                data['2013'] = d2013;
                data['2014'] = d2014;
                data['2015'] = d2015;
                data['2016'] = d2016;
                data['2017'] = d2017;
                draw('2017');
            });

        var slider = d3.select('#year');
        slider.on('change', function() {
            draw(this.value);
        });






})
