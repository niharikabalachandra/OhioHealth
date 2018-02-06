/* -----------------------------------------------
/* How to use? : Check the GitHub README
/* ----------------------------------------------- */

/* To load a config file (particles.json) you need to host this demo (MAMP/WAMP/local)... */
/*
particlesJS.load('particles-js', 'particles.json', function() {
  console.log('particles.js loaded - callback');
});
*/

/* Otherwise just put the config content (json): */
console.log('hi');
particlesJS('particles-js',
  
  {
    "particles": {
      "number": {
        "value": 80,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": "#ffffff"
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#000000"
        },
        "polygon": {
          "nb_sides": 5
        },
        "image": {
          "src": "img/github.svg",
          "width": 100,
          "height": 100
        }
      },
      "opacity": {
        "value": 0.5,
        "random": false,
        "anim": {
          "enable": false,
          "speed": 1,
          "opacity_min": 0.1,
          "sync": false
        }
      },
      "size": {
        "value": 5,
        "random": true,
        "anim": {
          "enable": false,
          "speed": 40,
          "size_min": 0.1,
          "sync": false
        }
      },
      "line_linked": {
        "enable": true,
        "distance": 150,
        "color": "#ffffff",
        "opacity": 0.4,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 6,
        "direction": "none",
        "random": false,
        "straight": false,
        "out_mode": "out",
        "attract": {
          "enable": false,
          "rotateX": 600,
          "rotateY": 1200
        }
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": true,
          "mode": "repulse"
        },
        "onclick": {
          "enable": true,
          "mode": "push"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 400,
          "line_linked": {
            "opacity": 1
          }
        },
        "bubble": {
          "distance": 400,
          "size": 40,
          "duration": 2,
          "opacity": 8,
          "speed": 3
        },
        "repulse": {
          "distance": 200
        },
        "push": {
          "particles_nb": 4
        },
        "remove": {
          "particles_nb": 2
        }
      }
    },
    "retina_detect": true,
    "config_demo": {
      "hide_card": false,
      "background_color": "#b61924",
      "background_image": "",
      "background_position": "50% 50%",
      "background_repeat": "no-repeat",
      "background_size": "cover"
    }
  }

);


(function(){ 
  // construct the d3 container
  var d3 = window.d3;
  var format = d3.format(".0f");

  var line = d3.svg.line();
  var width = 960,
      height = 960;

  var svg = d3.select("#container").append("svg")
    .attr('id', 'maps')
    .attr("viewBox", "0 0 1680 840");

  var usa = svg.append('svg:image')
    .attr("xlink:href","images/usa_BuPu_withLegend.svg")
    .attr('id', 'usa')
    .attr('class', 'map')
    .attr('width', width)
    .attr('height', height)
    .attr('x', 300)
    .on("click", zoomOut);

  var ohio = svg.append('svg:image')
    .attr("xlink:href","images/oh_BuPu.svg")
    .attr('id', 'ohio')
    .attr('class', 'map')
    .attr('width', 74)
    .attr('x', 934)
    .attr('y', 532)
    .attr('transform', 'rotate(-8 0 0)')
    .on("click", clicked);



function clicked(d) {

  var map = svg.selectAll("map");

  svg.transition()
    .duration(1000)
    .attr("transform", "translate(-2200,20)scale(12)")
    .ease('easeIn')
}

function zoomOut(d) {
    var map = svg.selectAll("map");

  svg.transition()
    .duration(1000)
    .attr("transform", "translate(0,0)scale(1)")
    .ease('easeIn')


}



})();


(function(){ 
  // construct the d3 container2: Twitter hashtag updates
  var d3 = window.d3;
  var format = d3.format(".0f");

  var line = d3.svg.line();
  var width = 480,
      height = 480;

  var svg = d3.select("#container2").append("svg")
    .attr('id', 'twitter')
    .attr("viewBox", "0 0 1680 840");

  var alpha = "#DigitalHealth|#FOAMed|#mhealth|#hcsm|#MedEd|#HealthTalk|#doctors20|#4patients|#HCR|#Hitsm".split("|");
	/* #DigitalHealth
	#FOAMed (Free open access meducaton)
	#mhealth (mobile health)
	#hcsm (healthcare social media)
	#MedEd (Medical Education)
	#HealthTalk
	#doctors20 (How Doctors are Using Social Media and Web 2.0 Tools)
	#4patients
	#HCR (Health Care Reform)
	#Hitsm (Health Care IT Social Media)*/
    var setup = d3.marcon()
        .top(20)
        .bottom(20)
        .left(10)
        .right(10)
        .width(window.innerWidth/2)
        .height(window.innerHeight/2);

    setup.render();

    var width = setup.innerWidth(), height = setup.innerHeight(), svg = setup.svg();

    var x = d3.scaleBand()
      .rangeRound([0, width])
      .domain(alpha)
      .padding(.2);

    var y = d3.scaleLinear()
      .range([height, 0])
      .domain([0, 100000]);

    var x_axis = d3.axisBottom(x);

    var y_axis = d3.axisRight(y)
      .tickSize(width)

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(x_axis);

    svg.append("g")
        .attr("class", "y axis")
        .call(customYAxis);

    var color = d3.scaleOrdinal(["#8da0cb","#8da0cb","#8da0cb","#8da0cb","#8da0cb","#8da0cb","#8da0cb"]);

    redraw(random_data());

    d3.interval(function(){
      redraw(random_data());
    }, 1000);

    function redraw(data){
      var x_var = Object.keys(data[0])[0], y_var = Object.keys(data[0])[1];
      
      y_axis.tickFormat(function(d, i, ticks){ return i == ticks.length - 1 ? d + " " + y_var + "s" : d; });
      d3.select(".y.axis").call(customYAxis);

      // join
      var bar = svg.selectAll(".bar")
        .data(data, function(d){ return d[x_var]; });

      var amount = svg.selectAll(".amount")
        .data(data, function(d){ return d[x_var]; });

      // update
      bar
        .transition()
          .attr("y", function(d){ return y(d[y_var]); })
          .attr("height", function(d){ return height - y(d[y_var]); });

      amount
        .transition()
          .attr("y", function(d){ return y(d[y_var]); })
          .text(function(d){ return d[y_var]; });

      // enter
      bar.enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d){ return x(d[x_var]); })
          .attr("y", function(d){ return y(d[y_var]); })
          .attr("width", x.bandwidth())
          .attr("height", function(d){ return height - y(d[y_var]); })
          .attr("fill", function(d){ return color(d[x_var]); });

      amount.enter().append("text")
          .attr("class", "amount")
          .attr("x", function(d){ return x(d[x_var]) + (x.bandwidth() / 2-17); })
          .attr("y", function(d){ return y(d[y_var]); })
          .attr("dy", 16)
          .text(function(d){ return d[y_var]; });

    }

    function random_data(){
      return alpha.map(function(d){
        return {
          name: d,
          value: jz.num.randBetween(1, 100000)
        }
      });
    }

    function customYAxis(g) {
      g.call(y_axis);
      g.select(".domain").remove();
      g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "#fff").attr("stroke-dasharray", "2,2");
      g.selectAll(".tick text").attr("x", 10).attr("dy", -4).attr("stroke", "#fff");
    }

})();




(function(){ 
  // construct the d3 container3: VC funding data
  var d3 = window.d3;
  var format = d3.format(".0f");

  var line = d3.svg.line();
  var width = 480,
      height = 480;

  var svg = d3.select("#container3").append("svg")
    .attr('id', 'VC')
    .attr("viewBox", "0 0 1680 840");
  
    var alphabet = "Health care|Analytics|Biotechnology|Big data|Robotics|Hospitality|Travel|Internet|Privacy|Social media|Data Center|Data Storage|Software|Biotechnology|Health Care|IT|3D printing|Robotics|Drones|Robotics|AI|Machine Learning".split("|");

    var width = window.innerWidth/2, height = window.innerHeight/2;

    var svg = d3.select("body").append("svg").attr("width", width).attr("height", height);

    var pack = d3.pack()
        .size([width, height])
        .padding(1.5);

    redraw(randomizeData());
    d3.interval(function(){
      redraw(randomizeData());
    }, 1000);

    function redraw(classes){

      // hierarchy
      var h = d3.hierarchy({children: classes})
          .sum(function(d) { return d.size; })

      //JOIN
      var circle = svg.selectAll("path")
          .data(pack(h).leaves(), function(d){ return d.data.name; });

      var text = svg.selectAll("text")
          .data(pack(h).leaves(), function(d){ return d.data.name; });

      //EXIT
      circle.exit()
          .style("fill", "#b26745")
        .transition()
          .attr("d", function(d){ return shape2path.circle({cx: d.x, cy: d.y, r: 1e-6}); })
          .remove();

      text.exit()
        .transition()
          .attr("opacity", 1e-6)
          .remove();

      //UPDATE
      circle
        .transition()
          .attr("d", function(d){ return shape2path.circle({cx: d.x, cy: d.y, r: d.r}); })
          .style("fill", "#3a403d");

      text
        .transition()
          .attr("x", function(d){ return d.x-30; })
          .attr("y", function(d){ return d.y; });

      //ENTER
      circle.enter().append("path")
          .attr("d", function(d){ return shape2path.circle({cx: d.x, cy: d.y, r: 1e-6}); })
          .style("fill", "#fff")
        .transition()
          .attr("d", function(d){ return shape2path.circle({cx: d.x, cy: d.y, r: d.r}); })
          .style("fill", "#45b29d");

      text.enter().append("text")
          .attr("opacity", 1e-6)
          .attr("x", function(d){ return d.x-30; })
          .attr("y", function(d){ return d.y; })
          .attr("dy", 6)
          .text(function(d){ return d.data.name; })
        .transition()
          .attr("opacity", 1);
    }

    function randomizeData(){
      var out = [];
      var shuffled = jz.arr.shuffle(alphabet);
      for (var i = 0; i < jz.num.randBetween(1, alphabet.length); i++){
        out.push({name: shuffled[i], size: jz.num.randBetween(1, 10)});
      }
      return out;
    }

 
	
})();


