json.sort(function(a,b){
  return b.value - a.value;
});

var dataArray = [];
var headers = ['Name', 'Value', {role: 'style'}, {role: 'annotation'}]
dataArray.push(headers);
json.forEach(function(d,i){
  d.category === 'A' ? fill = '#CCC' : fill =  '#8c6bb1';
  i === 0 || i === json.length - 1 ? annotation = d.value : annotation = null;
  dataArray.push([d.name, d.value, fill, annotation]);
});

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
  var data = google.visualization.arrayToDataTable(dataArray);

  var options = {
    chartArea: {
      top: 10,
      bottom: 0,
      left: 65,
      right: 50
    },
    hAxis: {
      gridlines: {
        color: '#fff'
      }
    },
    legend: 'none',
    vAxis: {
        textStyle: {
        fontName: 'Helvetica Neue',
        fontSize: 14
      }
    }
  };

  var chart = new google.visualization.BarChart(document.getElementById('chart'));

  chart.draw(data, options);
}
