var w=1250,
    h=540,
    margin={
      left:35,
      right:35,
      bottom:40,
      top:0
    };

var width=w-margin.left-margin.right,
    height=h-margin.bottom;
var colors=['rgb(0,127,36)',
            'rgb(98,191,24)',
            'rgb(255,200,0)',
            'rgb(255,91,19)',
            'rgb(229,0,0)'];

var ordinalColorScale=d3.scale.linear()
.domain([1,50,100,500,1000,2000])
.range(['rgb(0,127,36)',
        'rgb(98,191,24)',
        'rgb(255,200,0)',
        'rgb(255,91,19)',
        'rgb(229,0,0)']);

var svg=d3.select("#chart")
.append("svg")
.attr({
  width:width+margin.left+margin.right,
  height:height+margin.top+margin.bottom
});
var div=d3.select('body')
.append('div')
.classed('tooltip',true)
.style('opacity',0);

var chart=svg.append("g")
.attr("transform","translate("+margin.left+","+margin.top+")");
d3.json('data.json',function(error,data){
  if(error){
    throw error;
  }else{

  }
  var numSongs={};
  data.forEach(function(s){
    s.year=parseInt(s.year);
    s.rankedYear=parseInt(s.rankedYear);
  });
  
  
  var xScale=d3.time.scale()
  .domain([new Date(1950,0,1),new Date(2016,0,1)])
  .range([0,width]);

  
  
  var yScale=d3.scale.linear()
  .domain([0,100])
  .range([height,100]);
  
  var xAxis=d3.svg.axis()
  .scale(xScale)
  .orient('bottom')
  .tickFormat(d3.time.format('%Y'));
  
  var yAxis=d3.svg.axis()
  .scale(yScale)
  .orient('left');
  
  chart.append('g')
  .classed('x axis',true)
  .attr('transform','translate(0,'+height+')')
  .call(xAxis)
  .append('text')
  .attr({
    dx:width/2.2,
    dy:40,
    'font-size':'10px'
  })
  .text('Year of release');
  
  chart.append('g')
  .classed('y axis',true)
  .attr('transform','translate(0,0)')
  .call(yAxis)
  .append('text')
  .attr('transform','rotate(-90)')
  .attr({
    dx:-173,
    dy:17,
    'font-size':'10px'
  })
  .text('Number of Songs');
  
  chart.selectAll('.song')
  .data(data)
  .enter()
  .append('rect')
  .classed('song',true);
  chart.selectAll('.song')
  .data(data)
  .attr({
    x:function(d){
      if(!isNaN(d.year)){
        return xScale(new Date(d.year,0,1))-5;
      }
    },
    y:function(d){
      numSongs[d.year]=(numSongs[d.year]||0)+1;
      return yScale(numSongs[d.year]); 
    },
    width:(width/(2016-1950))-7,
    height:function(d){
      return height/100-2;
    },
    rx:1.5,
    ry:1.5,
    fill:function(d){
//      if(d.position>=1 && d.position<=49){
//        return colors[0];
//      }else if(d.position>=50 && d.position<=99){
//        return colors[1];
//      }else if(d.position>=100 && d.position<=499){
//        return colors[2];
//      }else if(d.position>=500 && d.position<=999){
//        return colors[3];
//      }if(d.position>=1000 && d.position<=2000){
//        return colors[4];
//      }
      console.log(d.position);
      return ordinalColorScale(d.position);
    }
  })
  .style('display',function(d){
    if(isNaN(d.year)==true || d.year>2016){
      return 'none';
    }
  })
  .on('mouseover',function(d){
    var self=this;
    
    d3.select(this)
    .classed('song-hover',true)
    
    d3.selectAll('.song')
    .style('opacity',0.3);
    
    d3.select('.song-hover')
    .style('opacity',1);
    
    div.transition()
    .duration(50)
    .style('opacity',0.75);
    
    div.html('<span style="text-transform:uppercase;font-size:16px;font-weight:800;">'+d.artist+'</span><hr><span><i>'+d.year+'</i></span><br><span style="font-size:15px;">'+d.title+'</span><br><span>Position in Top 2000 : <b>'+d.position+'</b></span>')
    .style('left',(d3.event.pageX-100)+'px')
    .style('top',(d3.event.pageY-150)+'px');
  })
  .on('mouseout',function(d){
    
    d3.selectAll('.song-hover')
    .classed('song-hover',false);
    
    d3.selectAll('.song')
    .style('opacity',1);
    
    div.transition()
    .duration(50)
    .style('opacity',0);
    
  });
  
  chart.selectAll('.song')
  .data(data)
  .exit()
  .remove();
  
  
  
  var legend=chart.selectAll('.lengend')
  .data(colors)
  .enter()
  .append("g")
  .classed('legend',true);
  
  legend.append('rect')
  .attr({
    x:width/1.03,
    y:function(d,i){
      return 110+i*30;
    },
    width:20,
    height:6,
    rx:3,
    ry:3,
    fill:function(d,i){
      return d;
    }
  })
  
  
  
  legend.append('text')
  .attr({
    x:width/1.03,
    y:function(d,i){
      return 110+i*30;
    },
    dy:'0.55em',
    dx:'-0.45em',
    'text-anchor':'end',
    fill:'white'
  })
  .text(function(d,i){
//    console.log(colorsRange(d));
    return colorsRange(d);
  });
  
  legend.on('mouseover',function(d){
    var element=colorsRange(d).split('-');
    var position1=parseInt(element[0]);
    var position2=parseInt(element[1]);
    
    d3.selectAll('.song')
    .style('opacity',function(d){
      if(d.position>=position1 && d.position<=position2){
        return 1;
      }else{
        return 0.3;
      }
    })
    
  })
  .on('mouseout',function(d){
    d3.selectAll('.song')
    .style('opacity',1);
  })
  
  legend.append('text')
  .attr({
    dx:width/1.148,
    dy:90,
    fill:'white',
    'font-size':'15px',
    'stroke-dasharray':'crispEdges'
  })
  .style({
    'text-transform':'uppercase',
    'stroke-dasharray':'crispEdges',
    'pointer-events':'none'
  })
  .text('Position in Top 2000');
  
  function colorsRange(c){
    if (c==colors[0]){
      return '1-49';
    }else if(c==colors[1]){
      return '50-99';
    }else if(c==colors[2]){
      return '100-499';
    }else if(c==colors[3]){
      return '500-999';
    }else{
      return '1000-2000';
    }
  }
});
  
  
