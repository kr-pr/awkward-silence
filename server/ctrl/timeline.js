var Convo = require('../schemas/Convo');
var linear = require('everpolate').linear;
var KMeans = require('kmeans-js');

var getTimestamp = function(val) {
    return parseInt(val.toString().slice(0,8), 16);//*1000;
};

var timeFromId = function(columns) {
  return columns.map(function(v){
    return v.map(function(item) {
      return {time: getTimestamp(item._id), value: item.value};
    });
  });
};

var getOverlapTime = function(columns){
  return columns.reduce(function(pr, cr){
    if (pr.min < cr[0].time) pr.min = cr[0].time;
    if (pr.max > cr[cr.length-1].time) pr.max = cr[cr.length-1].time;
    return pr;         
  },{ min: columns[0][0].time, max: columns[0][columns[0].length-1].time}); 
};

var resampleTime = function(bounds, step){
  var time = [];
  var nt = bounds.min;
  while (nt<bounds.max){
    time.push(nt);
    nt += step;
  }
  return time;
};

var interpolateColumns = function(columns, refTime){
  return columns.map(function(v){
    var times = v.map(function(item) {return item.time;});
    var values = v.map(function(item) {return item.value;});
    return linear(refTime, times, values);
  });
};

var normalize = function(columns){
  var bnds = columns.map(function(v){
    return {min: Math.min.apply(null, v), max: Math.max.apply(null, v)};
  });
  return columns.map(function(arr,ind){
    return arr.map(function(el){
      return (el-bnds[ind].min)/(bnds[ind].max-bnds[ind].min);
    });
  });
};


var reorderToRows = function(columns){
  var rows = [];
  for (var i = 0; i<columns[0].length; i++){
    var row = [];
    for (var j = 0; j<columns.length; j++) row.push(columns[j][i]);
    rows.push(row);
  }
  return rows;
};

var movingProp = function(arr, val, width){
  return arr.map(function(v,i){
    var bnds = { from: Math.round(i-width/2), to:Math.round(i+width/2) };
    if (bnds.from<0) bnds.from = 0;
    if (bnds.to>arr.length-1) bnds.to = arr.length-1;
    return arr
      .slice(bnds.from, bnds.to)
      .reduce(function(p,c, ind, a){
        return p+((c === val)?1:0)/a.length;
      },0);
  });
};

var process = function(points){

  var timePoints = timeFromId(points);
  var t = getOverlapTime(timePoints);
  //console.log('--------------t:', t);
  var cT = resampleTime(t, 1);
  //console.log('--------------cT:', cT); 
  var int = normalize(interpolateColumns(timePoints, cT));
  //console.log('--------------int:', int);
  var rows = reorderToRows(int);
  var km = new KMeans({K:int.length+1});
  km.cluster(rows);
  while (km.step()) {
      km.findClosestCentroids();
      km.moveCentroids();
      //console.log(km.centroids);
      if(km.hasConverged()) break;
  }
  //console.log('----------',km.clusters);
  var clusterNum = Array.from(cT);
  for(var i = 0; i < km.clusters.length; i++){
    for(var j = 0; j < km.clusters[i].length; j++){
      clusterNum[km.clusters[i][j]] = i;
    }
  }
  
  var propArr = []; 
  for(var i = 0; i<km.clusters.length; i++){
    propArr.push(movingProp(clusterNum, i, 8));
  }
  
  var propRows = reorderToRows(propArr);/*.map(function(v){
    return v.reduce(function(p,c,ind){
      if (!ind) p.push(c);
      else p.push(c+p[ind-1]);
      return p;
    },[]);
  }); */
  
  var out = cT.map(function(val, ind){
    return ({time:val, cluster:clusterNum[ind], records: rows[ind], props: propRows[ind] });
  });
  
  return {t: t, data: out};
};

var merge = function(comments, t){
  //console.log(comments, t);
  var timeComments = timeFromId(comments)
  .reduce(function(pr,cr){
    return pr.concat(cr);
  },[])
  .sort(function(a,b){return a.time-b.time;})
  .filter(function(val){return (val.time>t.min && val.time<t.max);});
  return timeComments;
  
};

module.exports = {
  update: function(convo){
    var points = [], comments = [];
    convo.records
    .forEach(function(record){
      if (record._doc.hasOwnProperty('points') && record._doc.points.length)
        points.push(record._doc.points);
      if (record._doc.hasOwnProperty('comments') && record._doc.comments.length)
        comments.push(record._doc.comments);
    });
    var result = process(points);
    return {comments: merge(comments, result.t), points: result.data};
  }
};